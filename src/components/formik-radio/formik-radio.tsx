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
  Radio,
  RadioGroup,
  UseRadioGroupProps,
  Stack,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikRadioProps extends InputProps {
  name: string;
  label: string;
  hideLabel?: boolean;
  controlProps?: FormControlProps;
  validate?: FieldValidator;
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
    console.log({ nextValue });
    helpers.setValue(nextValue);
  };

  console.log({ field, meta });

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
          <Radio value="group" colorScheme="orange">
            Group
          </Radio>
          <Radio value="accession" colorScheme="orange">
            Accession
          </Radio>
        </Stack>
      </RadioGroup>
      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikRadio;
