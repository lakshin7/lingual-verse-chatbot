
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  audioUrl?: string;
}

interface LanguageContextType {
  messages: Message[];
  addUserMessage: (text: string) => void;
  addBotMessage: (text: string, audioUrl?: string) => void;
  clearMessages: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    if (messages.length === 0) {
      addBotMessage('Welcome to LingualVerse! How can I help you with language learning today?');
    }
  }, []);

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const addBotMessage = (text: string, audioUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      audioUrl,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    // Re-add the welcome message when clearing
    addBotMessage('Welcome to LingualVerse! How can I help you with language learning today?');
  };

  return (
    <LanguageContext.Provider
      value={{
        messages,
        addUserMessage,
        addBotMessage,
        clearMessages,
        selectedLanguage,
        setSelectedLanguage,
        isListening,
        setIsListening,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
