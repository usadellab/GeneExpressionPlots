import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  VisuallyHidden,
  Select,
  SelectProps,
  Tooltip,
} from '@chakra-ui/react';

interface FormikSelectProps extends SelectProps {
  controlProps?: FormControlProps;
  hideLabel?: boolean;
  label: string;
  name: string;
  options: string[];
  validate?: FieldValidator;
  tooltip?: string;
}

const FormikSelect: React.FC<FormikSelectProps> = ({
  controlProps,
  hideLabel,
  label,
  name,
  validate,
  options,
  tooltip,
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
      <Select
        value={field.value}
        onChange={(event) => helpers.setValue(event.target.value)}
        onBlur={field.onBlur}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikSelect;
