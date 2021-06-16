import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikFieldProps extends InputProps {
  initialRef?: React.MutableRefObject<FocusableElement | null>;
  name: string;
  label: string;
  validate?: FieldValidator;
}

const FormikField: React.FC<FormikFieldProps> = ({
  initialRef,
  name,
  label,
  validate,
  ...props
}) => {
  const [field, meta] = useField({
    name,
    validate,
  });

  return (
    <FormControl
      as="p"
      isInvalid={meta.error !== undefined && meta.touched !== undefined}
      isRequired={props.isRequired}
    >
      <FormLabel fontWeight="semibold">{label}</FormLabel>
      <Input
        ref={(inputRef) =>
          initialRef ? (initialRef.current = inputRef) : inputRef
        }
        name={field.name}
        onBlur={field.onBlur}
        onChange={field.onChange}
        multiple={field.multiple}
        value={field.value}
        {...props}
      />
      {props.children}
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikField;
