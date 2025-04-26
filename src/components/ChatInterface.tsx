
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  correctGrammar,
  translateText,
  textToSpeech,
  analyzeSentiment,
  processMultilingual,
  speechToText
} from '@/services/apiService';

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    addUserMessage, 
    addBotMessage, 
    clearMessages,
    selectedLanguage,
    isListening,
    setIsListening,
    isProcessing,
    setIsProcessing
  } = useLanguage();
  
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  // Process message and get bot response
  const processMessage = async () => {
    if (messageInput.trim() === '') return;
    
    const userInput = messageInput.trim();
    addUserMessage(userInput);
    setMessageInput('');
    setIsProcessing(true);

    try {
      // Determine what action to take based on user input
      if (userInput.toLowerCase().includes('correct') || userInput.toLowerCase().includes('grammar')) {
        // Extract the text to correct
        const textToCorrect = userInput.replace(/correct|grammar/gi, '').trim();
        const corrected = await correctGrammar(textToCorrect || userInput);
        addBotMessage(corrected);
      } 
      else if (userInput.toLowerCase().includes('translate')) {
        // Extract the text to translate
        const textToTranslate = userInput.replace(/translate/gi, '').trim();
        const translated = await translateText(textToTranslate || userInput, selectedLanguage);
        const audioUrl = await textToSpeech(translated);
        addBotMessage(translated, audioUrl);
      } 
      else if (userInput.toLowerCase().includes('sentiment')) {
        // Extract the text for sentiment analysis
        const textToAnalyze = userInput.replace(/sentiment/gi, '').trim();
        const sentiment = await analyzeSentiment(textToAnalyze || userInput);
        addBotMessage(sentiment);
      } 
      else {
        // Default behavior: translate to selected language and speak
        const processed = await processMultilingual(userInput, 'auto', selectedLanguage);
        const audioUrl = await textToSpeech(processed);
        addBotMessage(processed, audioUrl);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      addBotMessage("I'm sorry, I encountered an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle keyboard Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      processMessage();
    }
  };

  // Handle send button click
  const handleSendClick = () => {
    if (!isProcessing) {
      processMessage();
    }
  };

  // Set up audio recording
  const setupMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        
        setIsProcessing(true);
        try {
          const transcription = await speechToText(audioBlob);
          addUserMessage(transcription.replace("You said: ", ""));
          
          // Process the transcription
          const processed = await processMultilingual(
            transcription.replace("You said: ", ""),
            'auto',
            selectedLanguage
          );
          
          const audioUrl = await textToSpeech(processed);
          addBotMessage(processed, audioUrl);
        } catch (error) {
          console.error("Error processing speech:", error);
          addBotMessage("I'm sorry, I had trouble processing your speech. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      };
      
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check your permissions.");
      setIsListening(false);
    }
  };

  // Toggle recording
  const toggleRecording = async () => {
    if (isListening) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        // Stop all audio tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      setIsListening(false);
    } else {
      if (!mediaRecorder) {
        await setupMediaRecorder();
      }
      
      if (mediaRecorder && mediaRecorder.state !== 'recording') {
        audioChunksRef.current = [];
        mediaRecorder.start();
        setIsListening(true);
      } else if (mediaRecorder) {
        // If recorder exists but in inactive state, setup again
        await setupMediaRecorder();
        audioChunksRef.current = [];
        mediaRecorder.start();
        setIsListening(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>Start a conversation with LingualVerse</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
                audioUrl={message.audioUrl}
              />
            ))}
            {isProcessing && (
              <div className="chat-bubble chat-bubble-bot max-w-[60%] animate-pulse">
                <div className="listening-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and control area */}
      <div className="flex flex-col mt-4">
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearMessages}
            disabled={isProcessing}
            className="text-xs"
          >
            <RotateCw className="h-3 w-3 mr-1" />
            New Conversation
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            disabled={isProcessing && !isListening}
            className="flex-shrink-0"
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            placeholder="Type your message here..."
            value={messageInput}
            onChange={handleInputChange}
            onKeyUp={handleKeyPress}
            disabled={isProcessing || isListening}
            className="flex-1"
          />
          <Button 
            onClick={handleSendClick} 
            disabled={messageInput.trim() === '' || isProcessing || isListening}
            className="flex-shrink-0 bg-language-primary hover:bg-language-dark"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        {isListening && (
          <div className="mt-2 text-center text-sm text-red-500 animate-pulse">
            Listening... Click the microphone again to stop.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
