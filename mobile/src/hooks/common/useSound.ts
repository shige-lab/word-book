import {useState} from 'react';
import Sound from 'react-native-sound';

export const useSound = () => {
  const [sound, setSound] = useState<Sound>();

  const stopSound = () => {
    if (sound) {
      sound.stop(() => {
        console.log('Sound stopped');
      });
    }
  };

  const playSound = (url: string) => {
    Sound.setCategory('Playback');
    // If there is already a sound playing, stop it before starting a new one
    if (sound) {
      sound.stop(() => {
        console.log('Sound stopped');
      });
    }

    const newSound = new Sound(url, undefined, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Play the sound once it is loaded
      newSound.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    });
    // Release the sound resource when playback is complete
    newSound.release();
    setSound(newSound);
  };
  return {playSound, stopSound};
};
