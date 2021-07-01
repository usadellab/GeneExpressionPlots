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

export interface XTableFormAttributes {
  countUnit: string;
  headerSep: string;
  columnSep: string;
  file?: File | null;
}

export type XTableFormSubmitHandler = (
  values: XTableFormAttributes,
  actions: FormikHelpers<XTableFormAttributes>
) => void;

export interface XTableFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: XTableFormSubmitHandler;
  children?:
    | React.ReactNode
    | ((formProps: FormikProps<XTableFormAttributes>) => React.ReactNode);
}

const XTableForm: React.FC<XTableFormProps> = (props) => {
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
        countUnit: 'Raw',
        headerSep: '*',
        columnSep: '\\t',
      }}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <Box
          as={Form}
          id="load-xtable"
          sx={{
            '& p:not(:first-of-type)': {
              marginTop: '1rem',
            },
          }}
        >
          <FormikField
            name="countUnit"
            label="Count Unit"
            initialFocusRef={props.initialFocusRef}
          />

          <FormikField
            name="headerSep"
            label="Header Separator"
            validate={validateSeparator}
            isRequired
          />

          <FormikField
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

export default XTableForm;

{
  /* <FormControl>
            <FormLabel>Count Unit</FormLabel>
            <Input
              ref={(ref) => (initialRef.current = ref)}
              list="count-units"
            />
            <datalist id="count-units">
              <option value="Raw" />
              <option value="TPM" />
              <option value="FPKM" />
              <option value="RPKM" />
              <option value="RPM" />
              <option value="CPM" />
              <option value="TMM" />
              <option value="DESeq" />
              <option value="GeTMM" />
              <option value="SCnorm" />
              <option value="ComBat-Seq" />
            </datalist>
          </FormControl>

          <FormControl>
            <FormLabel>Header Separator</FormLabel>
            <Input defaultValue="*" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Column Separator</FormLabel>
            <Input defaultValue="\t" list="column-seps" />
            <datalist id="column-seps">
              <option value="\t">tab-separated</option>
              <option value=",">comma-separated</option>
            </datalist>
          </FormControl>
          */
}
