import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  VisuallyHidden,
  Radio,
  RadioGroup,
  UseRadioGroupProps,
  Stack,
  StackDirection,
  RadioProps,
} from '@chakra-ui/react';

interface RadioOptions extends RadioProps {
  label: string;
  disabled: boolean;
}

interface FormikRadioProps {
  controlProps?: FormControlProps;
  direction?: StackDirection;
  hideLabel?: boolean;
  label: string;
  name: string;
  options: RadioOptions[];
  validate?: FieldValidator;
}

const FormikRadio: React.FC<FormikRadioProps> = ({
  controlProps,
  direction,
  hideLabel,
  label,
  name,
  options,
  validate,
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
        <Stack direction={direction}>
          {options.map((option, index) => (
            <Radio
              colorScheme="orange"
              key={`${option.label}-${index}`}
              value={option.value}
              isDisabled={option.disabled}
              {...option}
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
