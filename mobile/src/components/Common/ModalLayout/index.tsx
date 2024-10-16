import React from 'react';
import {Div, Modal, Text, Button, ScrollDiv} from 'react-native-magnus';
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ModalLayoutProps {
  title: string;
  titleColor?: string;
  isOpen: boolean;
  onClose: () => void;
  buttonText?: string;
  onButtonPress?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({
  title,
  titleColor,
  isOpen,
  onClose,
  children,
  buttonText,
  onButtonPress,
  isLoading = false,
  isDisabled = false,
}) => {
  const {height} = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const h = height - insets.top - 100;
  return (
    <Modal bg="base" isVisible={isOpen} onBackButtonPress={onClose}>
      <Pressable onPressIn={Keyboard.dismiss}>
        <Text
          px="lg"
          fontWeight={'bold'}
          fontSize={18}
          lineHeight={24}
          my="xl"
          color={titleColor || 'primary'}>
          {title}
        </Text>
      </Pressable>
      <Div h={h} px="lg">
        {children}
      </Div>
      <Div
        h={76}
        bottom={0}
        position={'absolute'}
        w={'100%'}
        pt={'md'}
        px="lg"
        borderTopWidth={1}
        borderColor="base1"
        bg="base2"
        row
        justifyContent={'space-between'}
        alignItems="flex-start">
        <TouchableOpacity
          onPress={() => {
            onClose();
          }}>
          <Div h={40} w={114} alignItems={'center'} justifyContent="center">
            <Text fontSize={16} color="brand500">
              Cancel
            </Text>
          </Div>
        </TouchableOpacity>
        {!!onButtonPress && (
          <Button
            loading={isLoading}
            bg={'brand500'}
            py={'md'}
            px={16}
            disabled={isDisabled}
            onPress={onButtonPress}
            rounded={5}
            fontWeight={'700'}
            fontSize={16}
            lineHeight={24}>
            {buttonText || 'Save'}
          </Button>
        )}
      </Div>
    </Modal>
  );
};

export default ModalLayout;
