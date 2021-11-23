import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import {
  Box,
  Button,
  Flex,
  useBreakpointValue,
  SystemProps,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikSelect from '@/components/formik-select';
import { dataTable, infoTable } from '@/store/data-store';
import FormikNumber from '@/components/formik-number';
import { GxpMapManColorScale } from '@/types/plots';

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
  colorScale: GxpMapManColorScale;
  colorScaleValueX?: number;
  colorScaleValueY?: number;
  sample?: string;
  plotTitle?: string;
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
  const colorScaleFlexDir = useBreakpointValue<
    SystemProps['flexDirection'] | undefined
  >({
    base: 'column',
    sm: 'row',
  });
  return (
    <Formik<MapManFormAttributes>
      initialValues={{
        infoTableColumn:
          infoTable.colNames.find((col) => col === 'MapMan_BINCODE') ??
          infoTable.colNames[0],
        infoTableColumnSep: ',',
        template: 'X4.3_Amino_acid_metabolism_R3.0',
        valuesFrom: infoTable.colNames[0],
        colorScale: 'diverging_-xx',
        sample: dataTable.sampleGroupsAsArray[0],
        colorScaleValueX: 3,
        colorScaleValueY: 3,
        plotTitle: '',
      }}
      validateOnBlur={false}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <Box as={Form}>
          <FormikField
            controlProps={{
              as: 'p',
            }}
            initialFocusRef={props.initialFocusRef}
            label="Plot Title"
            name="plotTitle"
          />
          <Flex
            gridGap="1rem"
            flexDirection={colorScaleFlexDir}
            marginTop="2rem"
          >
            <FormikSelect
              label="MapMan BINCODE column"
              name="infoTableColumn"
              options={infoTable.colNames.map((colName) => ({
                value: colName,
                label: colName,
              }))}
              tooltip="Select the column from your gene info table that holds MapMan BINCODE(s)."
              width="20rem"
            />

            <FormikField
              controlProps={{
                as: 'p',
              }}
              initialFocusRef={props.initialFocusRef}
              label="BINCODE separator"
              name="infoTableColumnSep"
              tooltip="In-column separator for MapMan BINCODEs, in case a gene is annotated with multiple bins."
              isRequired
            />
          </Flex>

          <FormikSelect
            controlProps={{
              marginTop: '1rem',
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
            tooltip="Select where to get the values to be plotted from. Can be any numeric value from the info table or mean expression values for a specific sample."
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
              tooltip="Select the sample to get the shown values for each gene from"
            />
          )}
          <Flex
            marginTop="2rem"
            gridGap="1rem"
            flexDirection={colorScaleFlexDir}
          >
            <FormikSelect
              label="Color Scale"
              name="colorScale"
              width={'20rem'}
              options={
                [
                  {
                    value: 'diverging_-xx',
                    label: 'diverging (-x to x)',
                  },
                  {
                    value: 'continuous_0q3',
                    label: 'continuous (0 to 3. quartile)',
                  },
                  {
                    value: 'continuous_q1q3',
                    label: 'continuous (1. quartile to 3. quartile)',
                  },
                  { value: 'continuous_xy', label: 'continuous (x to y)' },
                ] as { value: GxpMapManColorScale; label: string }[]
              }
              tooltip="Select a color scale for your values. For log2FC or similar, choose a divergent scale."
            />
            {formProps.values.colorScale === 'diverging_-xx' && (
              <FormikNumber
                label="Value (x)"
                name="colorScaleValueX"
                min={1}
                isRequired
              />
            )}
            {formProps.values.colorScale === 'continuous_xy' && (
              <>
                <FormikNumber
                  label="Value (x)"
                  name="colorScaleValueX"
                  isRequired
                />
                <FormikNumber
                  label="Value (y)"
                  name="colorScaleValueY"
                  isRequired
                />
              </>
            )}
          </Flex>

          <FormikSelect
            controlProps={{
              marginTop: '2rem',
            }}
            label="MapMan Template"
            name="template"
            options={templates}
            tooltip="Select the MapMan Pathway File to use as template for plotting your values"
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
              Load
            </Button>
          </Flex>
        </Box>
      )}
    </Formik>
  );
};

export default MapManForm;
