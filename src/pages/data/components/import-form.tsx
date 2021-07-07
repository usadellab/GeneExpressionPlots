import JSZip from 'jszip';
import FormikFile from '@/components/formik-file';
import { Box, Flex, Button } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import {
  FieldValidator,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import React from 'react';

export interface ImportGXPFormAttributes {
  file?: File | null;
}

export type ImportGXPFormSubmitHandler = (
  values: ImportGXPFormAttributes,
  actions: FormikHelpers<ImportGXPFormAttributes>
) => void;

export interface ImportGXPFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: ImportGXPFormSubmitHandler;
  children?:
    | React.ReactNode
    | ((formProps: FormikProps<ImportGXPFormAttributes>) => React.ReactNode);
}

const ImportGXPForm: React.FC<ImportGXPFormProps> = (props) => {
  const validateFileInput: FieldValidator = async (value: File) => {
    if (!value) return 'A file input is required';

    const zip = new JSZip();
    const database = await zip.loadAsync(value);

    if (database.files['GXP_settings.json'] === undefined) {
      return 'The database does not contain the "GXP_settings.json" file.';
    }

    if (database.files['expression_table.txt'] === undefined) {
      return 'The database does not contain the "expression_table.txt" file.';
    }
  };

  return (
    <Formik initialValues={{}} onSubmit={props.onSubmit} validateOnBlur={false}>
      {(formProps) => (
        <Box
          as={Form}
          id="import-gxp-db"
          sx={{
            '& p:not(:first-of-type)': {
              marginTop: '1rem',
            },
          }}
        >
          <FormikFile
            initialFocusRef={props.initialFocusRef}
            name="file"
            label="Tabular File"
            validate={validateFileInput}
            isRequired
          />

          {!props.children ? (
            <Flex as="p" paddingY={6} justifyContent="flex-end">
              <Button onClick={props.onCancel} variant="ghost">
                Cancel
              </Button>
              <Button
                colorScheme="orange"
                isLoading={formProps.isSubmitting}
                marginLeft=".5rem"
                type="submit"
                variant="solid"
              >
                Import
              </Button>
            </Flex>
          ) : typeof props.children === 'function' ? (
            props.children(formProps)
          ) : (
            props.children
          )}
        </Box>
      )}
    </Formik>
  );
};

export default ImportGXPForm;
