import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  Flex,
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Switch,
  SwitchProps,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikSwitchProps extends SwitchProps {
  id: string;
  name: string;
  label: string;
  leftChildren?: React.ReactNode;
  controlProps?: FormControlProps;
  hideLabel?: boolean;
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  rightChildren?: React.ReactNode;
  validate?: FieldValidator;
}

const FormikSwitch: React.FC<FormikSwitchProps> = ({
  // children,
  controlProps,
  hideLabel,
  initialFocusRef,
  label,
  name,
  validate,
  ...props
}) => {
  const [field, meta] = useField({
    name,
    validate,
  });

  return (
    <FormControl
      {...controlProps}
      isInvalid={meta.error !== undefined && meta.touched !== undefined}
    >
      <Flex alignItems="flex-end">
        <Switch
          colorScheme="orange"
          ref={(ref) =>
            initialFocusRef ? (initialFocusRef.current = ref) : ref
          }
          isChecked={field.value}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          {...props}
        />

        {hideLabel ? (
          <VisuallyHidden>
            <FormLabel htmlFor={props.id}>{label}</FormLabel>
          </VisuallyHidden>
        ) : (
          <FormLabel
            fontWeight="semibold"
            color="gray.600"
            htmlFor={props.id}
            marginBottom={0}
            marginLeft="1rem"
          >
            {label}
          </FormLabel>
        )}
      </Flex>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikSwitch;
