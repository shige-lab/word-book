import React from 'react';
import {Checkbox, Div, Icon} from 'react-native-magnus';

interface CustomCheckBoxProps {
  checked: boolean;
  onPress: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({checked, onPress}) => {
  return (
    <Div ml="sm" mr="lg">
      <Checkbox checked={checked} onPress={onPress}>
        {({checked}) => (
          <Div
            bg={checked ? 'blue600' : 'transparent'}
            w={20}
            h={20}
            borderWidth={2}
            borderColor={checked ? 'blue600' : 'gray300'}
            rounded="circle">
            {checked && (
              <Icon
                name="check"
                fontFamily="Feather"
                fontSize={16}
                color="white"
              />
            )}
          </Div>
        )}
      </Checkbox>
    </Div>
  );
};

export default CustomCheckBox;
