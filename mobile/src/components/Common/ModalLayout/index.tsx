import React from 'react';
import {Div, Modal, Text, Button, ScrollDiv} from 'react-native-magnus';
import {Dimensions, Platform, TouchableOpacity, View} from 'react-native';

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
  return (
    <Modal bg="base" isVisible={isOpen} onBackButtonPress={onClose}>
      <Text
        px="lg"
        fontWeight={'bold'}
        fontSize={18}
        lineHeight={24}
        my="xl"
        color={titleColor || 'primary'}>
        {title}
      </Text>
      <Div
        flex={Platform.OS === 'ios' ? undefined : 1}
        pb={Platform.OS === 'ios' ? 0 : 76}
        px="lg">
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
