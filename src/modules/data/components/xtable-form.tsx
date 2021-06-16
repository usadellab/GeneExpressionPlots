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

export interface XTableFormProps {
  initialRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: (
    values: XTableFormAttributes,
    actions: FormikHelpers<XTableFormAttributes>
  ) => void;
  children?:
    | React.ReactNode
    | ((formProps: FormikProps<XTableFormAttributes>) => React.ReactNode);
}

const ModalXTable: React.FC<XTableFormProps> = (props) => {
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
            initialRef={props.initialRef}
          />

          <FormikField
            name="headerSep"
            label="Header Separator"
            validate={validateSeparator}
          />

          <FormikField
            name="columnSep"
            label="Column Separator"
            validate={validateSeparator}
          />

          <FormikFile name="file" label="Tabular File" />

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

export default ModalXTable;

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
