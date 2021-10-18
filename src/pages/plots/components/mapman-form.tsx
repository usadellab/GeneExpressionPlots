import { Formik, Form, FieldValidator, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import FormikFile from '@/components/formik-file';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikSelect from '@/components/formik-select';
import { infoTable } from '@/store/data-store';

export type MapManFormSubmitHandler = (
  values: MapManFormAttributes,
  actions: FormikHelpers<MapManFormAttributes>
) => void;

export interface MapManFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: MapManFormSubmitHandler;
}

interface MapManFormAttributes {
  infoTableColumn: string;
  infoTableColumnSep: string;
}

const MapManForm: React.FC<MapManFormProps> = (props) => {
  return (
    <Formik<MapManFormAttributes>
      initialValues={{
        infoTableColumn: '',
        infoTableColumnSep: ',',
      }}
      validateOnBlur={false}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <Box as={Form}>
          <FormikSelect
            controlProps={{
              marginTop: '1rem',
            }}
            label="Info table column"
            name="infoTableColumn"
            options={infoTable.colNames.map((colName) => ({
              value: colName,
              label: colName,
            }))}
            tooltip="Select a column from your gene info table to test enrichment for"
          />
          <FormikField
            controlProps={{
              as: 'p',
              marginTop: '1rem',
            }}
            initialFocusRef={props.initialFocusRef}
            label="Info table column separator"
            name="infoTableColumnSep"
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

export default MapManForm;
