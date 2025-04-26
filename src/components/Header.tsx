
import React from 'react';
import LanguageSelector from './LanguageSelector';
import { Globe, MessageCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-language-primary to-language-secondary rounded-full p-2">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-language-primary to-language-secondary text-transparent bg-clip-text">
            LingualVerse
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span>Multilingual AI Assistant</span>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
