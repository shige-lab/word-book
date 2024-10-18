import React from 'react';
import {Icon} from 'react-native-magnus';
import {TouchableOpacity} from 'react-native';
import {useSound} from '../../../hooks/common/useSound';
import {playSoundFromText} from '../../../utils/playSoundFromText';

interface AudioButtonProps {
  word?: string;
  audio?: string;
  size?: number;
  color?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({
  word,
  audio,
  size,
  color,
}) => {
  const {playSound} = useSound();

  const playAudio = async () => {
    if (audio) {
      playSound(audio);
    } else if (word) {
      playSoundFromText(word);
    }
  };

  return (
    <TouchableOpacity onPress={playAudio}>
      <Icon
        name="volume-high"
        fontSize={size || 24}
        color={color || 'brand500'}
        fontFamily="MaterialCommunityIcons"
      />
    </TouchableOpacity>
  );
};

export default AudioButton;
