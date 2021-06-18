import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputProps,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikFieldProps extends InputProps {
  name: string;
  label: string;
  leftChildren?: React.ReactNode;
  hideLabel?: boolean;
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  rightChildren?: React.ReactNode;
  validate?: FieldValidator;
}

const FormikField: React.FC<FormikFieldProps> = ({
  children,
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
      <InputGroup>
        {props.leftChildren}
        <Input
          ref={(ref) =>
            initialFocusRef ? (initialFocusRef.current = ref) : ref
          }
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          multiple={field.multiple}
          value={field.value}
          {...props}
        />
        {children}
        {props.rightChildren}
      </InputGroup>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikField;
