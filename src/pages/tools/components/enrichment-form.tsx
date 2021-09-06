import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import { Box, Button, Flex, Divider } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import { TEFSelectorOption, TEISelectorType } from '@/types/enrichment';
import FormikSelect from '@/components/formik-select';
import { infoTable } from '@/store/data-store';

export type EnrichmentFormSubmitHandler = (
  values: EnrichmentAnalysisFormAttributes,
  actions: FormikHelpers<EnrichmentAnalysisFormAttributes>
) => void;

interface EnrichmentAnalysisFormAttributes {
  title: string;
  TEFcolumn: string;
  TEFselector: TEFSelectorOption;
  TEFselectorValue: string;
  TEIcolumn: string;
  TEIselectorBinary: TEFSelectorOption;
  TEIselectorMulti: 'delimiter' | 'regexp';
  TEIselectorType: TEISelectorType;
  TEIselectorValue: string;
}

export interface EnrichmentFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: EnrichmentFormSubmitHandler;
}

const TEFselectorOptions: TEFSelectorOption[] = [
  '<=',
  '>=',
  '<',
  '>',
  '==',
  'regexp',
];

const EnrichmentForm: React.FC<EnrichmentFormProps> = (props) => {
  return (
    <Formik<EnrichmentAnalysisFormAttributes>
      initialValues={{
        title: '',
        TEFcolumn: infoTable.colNames[0],
        TEFselector: '<',
        TEFselectorValue: '',
        TEIcolumn: infoTable.colNames[0],
        TEIselectorBinary: '<',
        TEIselectorMulti: 'delimiter',
        TEIselectorType: 'multinomial',
        TEIselectorValue: '',
      }}
      validateOnBlur={false}
      onSubmit={props.onSubmit}
    >
      {(formProps) => {
        return (
          <Box as={Form}>
            <FormikField
              controlProps={{
                as: 'p',
                marginTop: '1rem',
              }}
              initialFocusRef={props.initialFocusRef}
              label="Enrichment analysis title"
              name="title"
              isRequired
            />

            <Divider marginTop="1rem" />

            <FormikSelect
              controlProps={{
                marginTop: '1rem',
              }}
              label="Test enrichment for"
              name="TEFcolumn"
              options={infoTable.colNames.map((colName) => ({
                value: colName,
                label: colName,
              }))}
              tooltip="Select a column from your gene info table to test enrichment for"
            />

            <Flex alignItems="center" justifyContent="center">
              <FormikSelect
                controlProps={{
                  marginTop: '1rem',
                  flexShrink: 3,
                  marginRight: '1rem',
                }}
                label="Selector"
                name="TEFselector"
                options={TEFselectorOptions.map((option) => ({
                  value: option,
                  label: option,
                }))}
                tooltip="Choose a selector function to classify your column values"
              />

              <FormikField
                controlProps={{
                  as: 'p',
                  marginTop: '1rem',
                }}
                initialFocusRef={props.initialFocusRef}
                label="Selector Value"
                name="TEFselectorValue"
                isRequired
              />
            </Flex>

            <Divider marginTop="1rem" />

            <FormikSelect
              controlProps={{
                marginTop: '1rem',
              }}
              label="Test enrichment in"
              name="TEIcolumn"
              options={infoTable.colNames.map((colName) => ({
                value: colName,
                label: colName,
              }))}
              tooltip="Select a column from your gene info table to test enrichment in"
            />

            <Flex alignItems="center" justifyContent="center">
              <FormikSelect
                controlProps={{
                  marginTop: '1rem',
                  flexShrink: 2.8,
                  marginRight: '1rem',
                }}
                label="Selector type"
                name="TEIselectorType"
                options={[
                  { value: 'multinomial', label: 'multinomial' },
                  { value: 'binary', label: 'binary' },
                ]}
                tooltip="Choose a selector function to classify your column values."
              />
              {formProps.values.TEIselectorType === 'binary' ? (
                <FormikSelect
                  controlProps={{
                    marginTop: '1rem',
                    flexShrink: 3,
                    marginRight: '1rem',
                  }}
                  label="Selector"
                  name="TEIselectorBinary"
                  options={TEFselectorOptions.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  tooltip="Choose a selector function to classify your column values."
                />
              ) : (
                <FormikSelect
                  controlProps={{
                    marginTop: '1rem',
                    flexShrink: 3,
                    marginRight: '1rem',
                  }}
                  label="Selector"
                  name="TEIselectorMulti"
                  options={[
                    { value: 'delimiter', label: 'delimiter' },
                    { value: 'regexp', label: 'regexp' },
                  ]}
                  tooltip="Choose a selector function to classify your column values."
                />
              )}

              <FormikField
                controlProps={{
                  as: 'p',
                  marginTop: '1rem',
                  flexShrink: 2.2,
                }}
                initialFocusRef={props.initialFocusRef}
                label="Selector Value"
                name="TEIselectorValue"
                isRequired
              />
            </Flex>

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
                Run
              </Button>
            </Flex>
          </Box>
        );
      }}
    </Formik>
  );
};

export default EnrichmentForm;
