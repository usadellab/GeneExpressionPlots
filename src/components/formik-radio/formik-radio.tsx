import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  InputProps,
  VisuallyHidden,
  Radio,
  RadioGroup,
  UseRadioGroupProps,
  Stack,
} from '@chakra-ui/react';

interface RadioField {
  label: string;
  value: string;
  disabled: boolean;
}

interface FormikRadioProps extends InputProps {
  name: string;
  label: string;
  hideLabel?: boolean;
  controlProps?: FormControlProps;
  validate?: FieldValidator;
  options: RadioField[];
}

const FormikRadio: React.FC<FormikRadioProps> = ({
  controlProps,
  hideLabel,
  label,
  name,
  validate,
  ...props
}) => {
  const [field, meta, helpers] = useField({
    name,
    validate,
  });

  const handleOnChange: UseRadioGroupProps['onChange'] = (nextValue) => {
    helpers.setValue(nextValue);
  };

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
      <RadioGroup
        name={field.name}
        value={field.value}
        onChange={handleOnChange}
      >
        <Stack direction="row">
          {props.options.map((option, index) => (
            <Radio
              colorScheme="orange"
              key={`${option.label}-${index}`}
              value={option.value}
              isDisabled={option.disabled}
            >
              {option.label}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikRadio;
