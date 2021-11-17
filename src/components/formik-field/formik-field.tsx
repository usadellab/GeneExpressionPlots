import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputGroupProps,
  InputProps,
  VisuallyHidden,
  Tooltip,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikFieldProps extends InputProps {
  name: string;
  label: string;
  leftChildren?: React.ReactNode;
  hideLabel?: boolean;
  controlProps?: FormControlProps;
  groupProps?: InputGroupProps;
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  rightChildren?: React.ReactNode;
  validate?: FieldValidator;
  tooltip?: string;
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
  tooltip,
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
        <Tooltip label={tooltip} placement="auto">
          <FormLabel fontWeight="semibold">{label}</FormLabel>
        </Tooltip>
      )}
      <InputGroup as="span" {...groupProps}>
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
