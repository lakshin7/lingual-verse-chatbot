
// Request microphone permissions
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the tracks right away, we just needed to request permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (err) {
    console.error('Error requesting microphone permission:', err);
    return false;
  }
};

// Check if browser supports necessary audio APIs
export const isAudioSupported = (): boolean => {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.MediaRecorder &&
    window.AudioContext
  );
};

// Format audio duration
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};
