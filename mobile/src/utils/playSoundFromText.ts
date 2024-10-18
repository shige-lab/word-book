import Tts from 'react-native-tts';

export const playSoundFromText = async (text: string) => {
  Tts.speak(text);
};
