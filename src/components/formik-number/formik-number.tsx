import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputGroupProps,
  NumberInput,
  NumberInputProps,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikFieldProps extends NumberInputProps {
  name: string;
  label: string;
  leftChildren?: React.ReactNode;
  hideLabel?: boolean;
  controlProps?: FormControlProps;
  groupProps?: InputGroupProps;
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  rightChildren?: React.ReactNode;
  validate?: FieldValidator;
}

const FormikField: React.FC<FormikFieldProps> = ({
  children,
  controlProps,
  groupProps,
  hideLabel,
  initialFocusRef,
  label,
  leftChildren,
  name,
  rightChildren,
  validate,
  ...props
}) => {
  const [field, meta, helpers] = useField({
    name,
    validate,
  });

  return (
    <FormControl
      {...controlProps}
      isInvalid={meta.error !== undefined && meta.touched !== undefined}
      isRequired={props.isRequired}
    >
      {hideLabel ? (
        <VisuallyHidden>
          <FormLabel fontWeight="semibold">{label}</FormLabel>
        </VisuallyHidden>
      ) : (
        <FormLabel fontWeight="semibold">{label}</FormLabel>
      )}
      <InputGroup {...groupProps}>
        {leftChildren}
        <NumberInput
          {...props}
          name={field.name}
          value={field.value}
          onChange={(value) => helpers.setValue(value ? parseFloat(value) : '')}
        >
          <NumberInputField
            ref={(ref) =>
              initialFocusRef ? (initialFocusRef.current = ref) : ref
            }
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {children}
        {rightChildren}
      </InputGroup>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikField;
