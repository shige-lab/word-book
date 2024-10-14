import React from 'react';
import {Div, Text} from 'react-native-magnus';

type ModalFieldProps = {
  errors?: string;
  touched?: boolean;
  label: string;
  isRequired?: boolean;
  rightIcon?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
};

const ModalField: React.FC<ModalFieldProps> = ({
  errors,
  touched,
  label,
  isRequired = false,
  rightIcon,
  description,
  children,
}) => {
  return (
    <>
      <Div flexDir="column" justifyContent="flex-start" mb="md">
        <Div
          mb={'sm'}
          w="100%"
          flexDir="row"
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Text mr={'sm'} fontWeight={'bold'} fontSize={16}>
            {label}
          </Text>
          {isRequired ? (
            <Text color="#EC3F19" fontWeight={'bold'} fontSize={12}>
              ＊
            </Text>
          ) : null}
          {!!rightIcon && <Div ml={'auto'}>{rightIcon}</Div>}
        </Div>
        {errors && touched ? (
          <Text mb={'sm'} color="tomato">
            {errors}
          </Text>
        ) : null}
        {children}
        {description ? (
          <Text mt={'md'} fontSize={14}>
            {description}
          </Text>
        ) : null}
      </Div>
    </>
  );
};

export default ModalField;
