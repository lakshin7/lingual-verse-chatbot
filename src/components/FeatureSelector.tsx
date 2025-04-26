
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Languages, 
  Sparkles, 
  VolumeX, 
  Mic, 
  PenTool 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, onClick }) => (
  <Button
    variant="ghost"
    className="w-full justify-start gap-3 h-auto py-3 px-4 hover:bg-accent/50"
    onClick={onClick}
  >
    <div className="rounded-full bg-accent/50 p-2">{icon}</div>
    <div className="text-left">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </Button>
);

const FeatureSelector: React.FC = () => {
  const { addBotMessage } = useLanguage();

  const handleFeatureClick = (message: string) => {
    addBotMessage(message);
  };

  return (
    <div className="w-full flex flex-col gap-2 p-4">
      <h2 className="text-xl font-bold text-center mb-2">LingualVerse Features</h2>
      <Separator />
      
      <Feature
        icon={<MessageSquare className="h-4 w-4" />}
        title="Chat"
        description="Have a conversation in your target language"
        onClick={() => handleFeatureClick("Let's practice conversation! Type or speak in any language.")}
      />
      
      <Feature
        icon={<Sparkles className="h-4 w-4" />}
        title="Grammar Correction"
        description="Correct your grammar in any language"
        onClick={() => handleFeatureClick("I can correct your grammar. Type 'correct: [your text]'")}
      />
      
      <Feature
        icon={<Languages className="h-4 w-4" />}
        title="Translation"
        description="Translate between languages"
        onClick={() => handleFeatureClick("I can translate text for you. Type 'translate: [your text]'")}
      />
      
      <Feature
        icon={<PenTool className="h-4 w-4" />}
        title="Sentiment Analysis"
        description="Analyze the sentiment of your text"
        onClick={() => handleFeatureClick("I can analyze the sentiment of your text. Type 'sentiment: [your text]'")}
      />
      
      <Feature
        icon={<VolumeX className="h-4 w-4" />}
        title="Text-to-Speech"
        description="Listen to pronunciation"
        onClick={() => handleFeatureClick("I can speak the translated text. Just send any message to hear it pronounced correctly.")}
      />
      
      <Feature
        icon={<Mic className="h-4 w-4" />}
        title="Speech-to-Text"
        description="Practice speaking and get feedback"
        onClick={() => handleFeatureClick("Press the microphone button to speak, and I'll transcribe your speech and respond.")}
      />
      
      <Separator className="mt-2" />
      
      <div className="text-xs text-center text-muted-foreground mt-2">
        Powered by LingualVerse NLP technology
      </div>
    </div>
  );
};

export default FeatureSelector;
