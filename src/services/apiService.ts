
import { API_CONFIG } from '@/config/environment';

// API base URL - configured from environment
const API_BASE_URL = API_CONFIG.BASE_URL;

// API endpoints
const ENDPOINTS = {
  grammar: '/correct',
  translate: '/translate',
  tts: '/tts',
  sentiment: '/sentiment',
  multilingual: '/multilingual',
  speech: '/speech'
};

// Interface for messages
interface MessageRequest {
  message: string;
  target_lang?: string;
  source_lang?: string;
}

// Function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An error occurred with the API');
};

// Grammar correction API
export const correctGrammar = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.grammar}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    return handleApiError(error);
  }
};

// Translation API
export const translateText = async (message: string, targetLang: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.translate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, target_lang: targetLang }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    return handleApiError(error);
  }
};

// Text-to-speech API
export const textToSpeech = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.tts}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.audio_url;
  } catch (error) {
    return handleApiError(error);
  }
};

// Sentiment analysis API
export const analyzeSentiment = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.sentiment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    return handleApiError(error);
  }
};

// Multilingual API
export const processMultilingual = async (message: string, sourceLang: string, targetLang: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.multilingual}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, source_lang: sourceLang, target_lang: targetLang }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    return handleApiError(error);
  }
};

// Speech-to-text API
export const speechToText = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.speech}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    return handleApiError(error);
  }
};
