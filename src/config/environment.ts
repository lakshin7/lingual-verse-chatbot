
// Environment configuration
const isDevelopment = import.meta.env.DEV;

// Configure API URL based on environment
export const API_CONFIG = {
  // Use the Flask backend URL in development, default to deployed URL in production
  BASE_URL: isDevelopment 
    ? 'http://localhost:5001'
    : import.meta.env.VITE_API_URL || 'https://api.lingualverse.com',
};

// Configure features
export const FEATURES = {
  SPEECH_ENABLED: true,
  TRANSLATION_ENABLED: true,
  GRAMMAR_ENABLED: true,
  SENTIMENT_ENABLED: true,
};

// Export environment information
export const ENV_INFO = {
  IS_DEVELOPMENT: isDevelopment,
};
