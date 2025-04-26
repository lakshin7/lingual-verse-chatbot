
import { API_CONFIG } from '@/config/environment';

/**
 * Checks if the API is reachable and returns the status
 * @returns Promise<boolean> True if API is accessible, false otherwise
 */
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    // Try to reach the API with a simple HEAD request
    const response = await fetch(`${API_CONFIG.BASE_URL}`, {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout to avoid long waits
      signal: AbortSignal.timeout(3000),
    });
    
    return response.ok;
  } catch (error) {
    console.warn('API status check failed:', error);
    return false;
  }
};

/**
 * Simple utility to format API URL for display
 */
export const getApiUrl = (): string => {
  return API_CONFIG.BASE_URL;
};
