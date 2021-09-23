import { Formik, Form, FieldValidator, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import FormikFile from '@/components/formik-file';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

export type ImageFormSubmitHandler = (
  values: ImageFormAttributes,
  actions: FormikHelpers<ImageFormAttributes>
) => void;

export interface ImageFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: ImageFormSubmitHandler;
}

interface ImageFormAttributes {
  file?: File | null;
  alt: string;
}

enum ImageFormErrors {
  FILE_EMPTY = 'An image file is required',
  FILE_FORMAT = 'Supported formats are: png',
  ALT_EMPTY = 'An image label is required',
}

const iMAGEForm: React.FC<ImageFormProps> = (props) => {
  const validateFileInput: FieldValidator = (value: File) => {
    if (!value) return ImageFormErrors.FILE_EMPTY;
    if (value.type !== 'image/png') return ImageFormErrors.FILE_FORMAT;
  };

  const validateAltInput: FieldValidator = (value: string) => {
    if (!value) return ImageFormErrors.ALT_EMPTY;
  };

  return (
    <Formik<ImageFormAttributes>
      initialValues={{
        alt: '',
      }}
      validateOnBlur={false}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <Box as={Form}>
          <FormikField
            controlProps={{
              as: 'p',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}
            initialFocusRef={props.initialFocusRef}
            isRequired
            label="Image label"
            name="alt"
            validate={validateAltInput}
          />

          <FormikFile
            name="file"
            label="Image file"
            validate={validateFileInput}
            isRequired
          />

          <Flex as="p" paddingY={6} justifyContent="flex-end">
            <Button onClick={props.onCancel} colorScheme="red" variant="ghost">
              Cancel
            </Button>

            <Button
              colorScheme="orange"
              isLoading={formProps.isSubmitting}
              marginLeft=".5rem"
              type="submit"
              variant="solid"
            >
              Add
            </Button>
          </Flex>
        </Box>
      )}
    </Formik>
  );
};

export default iMAGEForm;
