import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikSelect from '@/components/formik-select';
import { dataTable, infoTable } from '@/store/data-store';

export type MapManFormSubmitHandler = (
  values: MapManFormAttributes,
  actions: FormikHelpers<MapManFormAttributes>
) => void;

export interface MapManFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: MapManFormSubmitHandler;
}

export interface MapManFormAttributes {
  infoTableColumn: string;
  infoTableColumnSep: string;
  template: string;
  valuesFrom: string;
  colorScale: 'sequential' | 'linear';
  sample?: string;
}

const templates = [
  {
    label: 'Amino acid metabolism',
    value: 'X4.3_Amino_acid_metabolism_R3.0',
  },
  {
    label: 'Carbohydrate metabolism',
    value: 'X4.3_Carbohydrate_metabolism_R3.0',
  },
  {
    label: 'Cellular respiration',
    value: 'X4.3_Cellular_respiration_R3.0',
  },
  { label: 'Coenzyme metabolism', value: 'X4.3_Coenzyme_metabolism_R3.0' },
  { label: 'GA synthesis', value: 'X4.3_GA_synthesis_R3.0' },
  { label: 'JA synthesis', value: 'X4.3_JA_synthesis_R3.0' },
  { label: 'Lignin', value: 'X4.3_Lignin_R3.0' },
  { label: 'Lipid metabolism', value: 'X4.3_Lipid_metabolism_R3.0' },
  { label: 'Metabolism overview', value: 'X4.3_Metabolism_overview_R3.0' },
  {
    label: 'Nucleotide metabolism',
    value: 'X4.3_Nucleotide_metabolism_R3.0',
  },
  { label: 'Photosynthesis', value: 'X4.3_Photosynthesis_R3.0' },
  {
    label: 'Polyamine metabolism',
    value: 'X4.3_Polyamine_metabolism_R3.0',
  },
  {
    label: 'Secondary metabolism',
    value: 'X4.3_Secondary_metabolism_R3.0',
  },
  {
    label: 'Tetrapyrrole biosynthesis',
    value: 'X4.3_Tetrapyrrole_biosynthesis_R3.0',
  },
  {
    label: 'Tocopherol biosynthesis',
    value: 'X4.3_Tocopherol_biosynthesis_R3.0',
  },
  { label: 'Vesicle trafficking', value: 'X4.3_Vesicle_trafficking_R3.0' },
];

const MapManForm: React.FC<MapManFormProps> = (props) => {
  return (
    <Formik<MapManFormAttributes>
      initialValues={{
        infoTableColumn: infoTable.colNames[0],
        infoTableColumnSep: ',',
        template: 'X4.3_Amino_acid_metabolism_R3.0',
        valuesFrom: infoTable.colNames[0],
        colorScale: 'linear',
        sample: dataTable.sampleGroupsAsArray[0],
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
            label="MapMan Info table column"
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
            label="MapMan Info table column separator"
            name="infoTableColumnSep"
            isRequired
          />

          <FormikSelect
            controlProps={{
              marginTop: '2rem',
            }}
            label="Values from"
            name="valuesFrom"
            options={infoTable.colNames.reduce(
              (acc, colName) => {
                acc.push({ value: colName, label: colName });
                return acc;
              },
              [{ value: 'expressionValue', label: 'Mean expression value' }]
            )}
          />
          {formProps.values.valuesFrom == 'expressionValue' && (
            <FormikSelect
              controlProps={{
                marginTop: '1rem',
              }}
              label="Sample"
              name="sample"
              options={dataTable.sampleGroupsAsArray.map((sample) => ({
                label: sample,
                value: sample,
              }))}
            />
          )}

          <FormikSelect
            controlProps={{
              marginTop: '1rem',
            }}
            label="Color Scale"
            name="colorScale"
            options={[
              { value: 'linear', label: 'linear' },
              { value: 'sequential', label: 'sequential [-1,1]' },
            ]}
          />

          <FormikSelect
            controlProps={{
              marginTop: '2rem',
            }}
            label="MapMan Template"
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
