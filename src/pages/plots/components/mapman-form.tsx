import { Formik, Form, FieldValidator, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import FormikFile from '@/components/formik-file';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikSelect from '@/components/formik-select';
import { infoTable } from '@/store/data-store';
import { values } from 'mobx';

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
  template: string;
}

const templates = [
  {
    label: 'Amino acid metabolism',
    value: 'X4.3_Amino_acid_metabolism_R3.0.svg',
  },
  {
    label: 'Carbohydrate metabolism',
    value: 'X4.3_Carbohydrate_metabolism_R3.0.svg',
  },
  {
    label: 'Cellular respiration',
    value: 'X4.3_Cellular_respiration_R3.0.svg',
  },
  { label: 'Coenzyme metabolism', value: 'X4.3_Coenzyme_metabolism_R3.0.svg' },
  { label: 'GA synthesis', value: 'X4.3_GA_synthesis_R3.0.svg' },
  { label: 'JA synthesis', value: 'X4.3_JA_synthesis_R3.0.svg' },
  { label: 'Lignin', value: 'X4.3_Lignin_R3.0.svg' },
  { label: 'Lipid metabolism', value: 'X4.3_Lipid_metabolism_R3.0.svg' },
  { label: 'Metabolism overview', value: 'X4.3_Metabolism_overview_R3.0.svg' },
  {
    label: 'Nucleotide metabolism',
    value: 'X4.3_Nucleotide_metabolism_R3.0.svg',
  },
  { label: 'Photosynthesis', value: 'X4.3_Photosynthesis_R3.0.svg' },
  {
    label: 'Polyamine metabolism',
    value: 'X4.3_Polyamine_metabolism_R3.0.svg',
  },
  {
    label: 'Secondary metabolism',
    value: 'X4.3_Secondary_metabolism_R3.0.svg',
  },
  {
    label: 'Tetrapyrrole biosynthesis',
    value: 'X4.3_Tetrapyrrole_biosynthesis_R3.0.svg',
  },
  {
    label: 'Tocopherol biosynthesis',
    value: 'X4.3_Tocopherol_biosynthesis_R3.0.svg',
  },
  { label: 'Vesicle trafficking', value: 'X4.3_Vesicle_trafficking_R3.0.svg' },
];

const MapManForm: React.FC<MapManFormProps> = (props) => {
  return (
    <Formik<MapManFormAttributes>
      initialValues={{
        infoTableColumn: infoTable.colNames[0],
        infoTableColumnSep: ',',
        template: 'Amino acid metabolism',
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
          <FormikSelect
            controlProps={{
              marginTop: '1rem',
            }}
            label="MapMan Templates"
            name="template"
            options={templates}
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
