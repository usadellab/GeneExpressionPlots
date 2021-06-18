import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputGroupProps,
  InputProps,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikFieldProps extends InputProps {
  name: string;
  label: string;
  leftChildren?: React.ReactNode;
  hideLabel?: boolean;
  groupProps?: InputGroupProps;
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  rightChildren?: React.ReactNode;
  validate?: FieldValidator;
}

const FormikField: React.FC<FormikFieldProps> = ({
  children,
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
      <InputGroup {...groupProps}>
        {leftChildren}
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
        {rightChildren}
      </InputGroup>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikField;
