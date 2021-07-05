import FormikFile from '@/components/formik-file';
import FormikField from '@/components/formik-field';
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

export interface InfoFormAttributes {
  columnSep: string;
  file?: File | null;
}

export type InfoFormSubmitHandler = (
  values: InfoFormAttributes,
  actions: FormikHelpers<InfoFormAttributes>
) => void;

export interface InfoFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: InfoFormSubmitHandler;
  children?:
    | React.ReactNode
    | ((formProps: FormikProps<InfoFormAttributes>) => React.ReactNode);
}

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const validateFileInput: FieldValidator = (value: File) => {
    if (!value) return 'A file input is required';
  };

  const validateSeparator: FieldValidator = (value: string) => {
    let error;

    if (!value) {
      error = 'A separator value is required';
    } else if ((value.length > 1 && value[0] !== '\\') || value.length > 2) {
      error =
        'Separators must be one character long' +
        ' (escaped characters are supported)';
    }

    return error;
  };

  return (
    <Formik
      initialValues={{
        columnSep: '\\t',
      }}
      onSubmit={props.onSubmit}
      validateOnBlur={false}
    >
      {(formProps) => (
        <Box
          as={Form}
          id="load-gene-info-table"
          sx={{
            '& p:not(:first-of-type)': {
              marginTop: '1rem',
            },
          }}
        >
          <FormikField
            initialFocusRef={props.initialFocusRef}
            name="columnSep"
            label="Column Separator"
            validate={validateSeparator}
            isRequired
          />

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

export default InfoForm;
