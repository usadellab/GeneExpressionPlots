import React from 'react';

import { Formik, Form, FormikHelpers, FieldValidator } from 'formik';

import FormikFile from '@/components/formik-file';

import { Box, Button, Flex } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikSwitch from '@/components/formik-switch';

export type MercatorFormSubmitHandler = (
  values: MercatorFormAttributes,
  actions: FormikHelpers<MercatorFormAttributes>
) => void;

interface MercatorFormAttributes {
  file?: File | null;
  addName: boolean;
  addDescription: boolean;
}

export interface MercatorFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: MercatorFormSubmitHandler;
}

const MercatorForm: React.FC<MercatorFormProps> = (props) => {
  const validateFileInput: FieldValidator = (value: File) => {
    if (!value) return 'A file input is required';
  };

  return (
    <Formik<MercatorFormAttributes>
      initialValues={{
        addName: false,
        addDescription: false,
      }}
      validateOnBlur={false}
      onSubmit={props.onSubmit}
    >
      {(formProps) => {
        return (
          <Box as={Form}>
            <FormikFile
              name="file"
              label="Tabular File"
              validate={validateFileInput}
              isRequired
            />

            <FormikSwitch
              controlProps={{
                marginTop: '1rem',
              }}
              color="orange.600"
              id="add-name"
              name="addName"
              label="add Mercator Name column"
            />

            <FormikSwitch
              controlProps={{
                marginTop: '1rem',
              }}
              color="orange.600"
              id="add-description"
              name="addDescription"
              label="add Mercator Description column"
            />

            <Flex as="p" paddingY={6} justifyContent="flex-end">
              <Button
                onClick={props.onCancel}
                colorScheme="red"
                variant="ghost"
              >
                Cancel
              </Button>

              <Button
                colorScheme="orange"
                isLoading={formProps.isSubmitting}
                marginLeft=".5rem"
                type="submit"
                variant="solid"
              >
                Load
              </Button>
            </Flex>
          </Box>
        );
      }}
    </Formik>
  );
};

export default MercatorForm;
