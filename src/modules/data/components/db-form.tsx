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

export interface DbFormAttributes {
  file?: File | null;
}

export type DbFormSubmitHandler = (
  values: DbFormAttributes,
  actions: FormikHelpers<DbFormAttributes>
) => void;

export interface DbFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: DbFormSubmitHandler;
  children?:
    | React.ReactNode
    | ((formProps: FormikProps<DbFormAttributes>) => React.ReactNode);
}

const DbForm: React.FC<DbFormProps> = (props) => {
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
    <Formik initialValues={{}} onSubmit={props.onSubmit}>
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
                Load
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

export default DbForm;
