import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  Box,
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputGroupProps,
  InputProps,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import { useMatchReplicate } from '@/hooks';

interface FormikReplicateProps extends InputProps {
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

const FormikReplicate: React.FC<FormikReplicateProps> = ({
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
  const [field, meta] = useField({
    name,
    validate,
  });

  const matches = useMatchReplicate({
    replicate: field.value,
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
          list={`${field.name}-list`}
        />

        <Box as="datalist" id={`${field.name}-list`}>
          {matches.map((match) => (
            <Box as="option" key={match} value={match} />
          ))}
        </Box>

        {children}
        {rightChildren}
      </InputGroup>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikReplicate;
