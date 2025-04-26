
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Volume, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  audioUrl?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  const handlePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error);
          toast.error('Failed to play audio. Please try again.');
        });
        setIsPlaying(true);
      }
    } else if (audioUrl) {
      // If audio url exists but audioRef is null, create an audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error);
        toast.error('Failed to play audio. Please try again.');
      });
      setIsPlaying(true);
    }
  };

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  // Function to copy message text
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message)
      .then(() => toast.success('Message copied to clipboard'))
      .catch(() => toast.error('Failed to copy message'));
  };

  return (
    <div
      className={cn(
        'flex flex-col max-w-[80%] mb-4',
        sender === 'user' ? 'items-end self-end' : 'items-start self-start'
      )}
    >
      <div
        className={cn(
          'chat-bubble',
          sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
        )}
      >
        <div className="text-sm md:text-base">{message}</div>
        
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>{formattedTime}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full hover:bg-gray-200"
              onClick={copyToClipboard}
              title="Copy message"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            {audioUrl && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full hover:bg-gray-200"
                onClick={handlePlay}
                title="Play audio"
              >
                <Volume className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
