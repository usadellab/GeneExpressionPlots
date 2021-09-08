import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  VisuallyHidden,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikAreaProps extends TextareaProps {
  name: string;
  label: string;
  hideLabel?: boolean;
  controlProps?: FormControlProps;
  validate?: FieldValidator;
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
}

const FormikArea: React.FC<FormikAreaProps> = ({
  controlProps,
  hideLabel,
  label,
  name,
  validate,
  initialFocusRef,
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
      isRequired={props.isRequired}
    >
      {hideLabel ? (
        <VisuallyHidden>
          <FormLabel fontWeight="semibold">{label}</FormLabel>
        </VisuallyHidden>
      ) : (
        <FormLabel fontWeight="semibold">{label}</FormLabel>
      )}
      <Textarea
        ref={(ref) => (initialFocusRef ? (initialFocusRef.current = ref) : ref)}
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...props}
      />
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikArea;
