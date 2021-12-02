import { Formik, Form, FormikHelpers, FieldArray } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import {
  Box,
  Button,
  Flex,
  Divider,
  VisuallyHidden,
  Icon,
  IconButton,
  InputRightAddon,
  FormLabel,
} from '@chakra-ui/react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { FocusableElement } from '@chakra-ui/utils';
import { TEFSelectorOption, TEISelectorType } from '@/types/enrichment';
import FormikSelect from '@/components/formik-select';
import { infoTable } from '@/store/data-store';
import FormikArea from '@/components/formik-area';
import FormikAccession from '@/components/formik-accession';
import { toJS } from 'mobx';
import { useMemo } from 'react';
import { isNumericColumn } from '@/utils/validation';

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
  accessions: string[];
  accessionsList: string;
  valuesFrom: string;
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
  const valuesFromOptions = useMemo(() => {
    const slicedColumns = toJS(infoTable.sliceColumns(0, 9));

    return slicedColumns.reduce(
      (acc, column, i) => {
        if (isNumericColumn(column)) {
          const colName = infoTable.colNames[i];
          acc.push({ value: colName, label: colName });
        }
        return acc;
      },
      [{ value: 'expressionValue', label: 'Mean expression value' }]
    );
  }, []);

  return (
    <Formik<EnrichmentAnalysisFormAttributes>
      initialValues={{
        accessions: [],
        accessionsList: '',
        title: '',
        TEFcolumn: infoTable.colNames[0],
        TEFselector: '<',
        TEFselectorValue: '',
        TEIcolumn: infoTable.colNames[0],
        TEIselectorBinary: '<',
        TEIselectorMulti: 'delimiter',
        TEIselectorType: 'multinomial',
        TEIselectorValue: '',
        valuesFrom: valuesFromOptions[0].value,
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
              options={valuesFromOptions}
              // options={infoTable.colNames.map((colName) => ({
              //   value: colName,
              //   label: colName,
              // }))}
              tooltip="Select a column from your gene info table to test enrichment for"
            />

            <FieldArray name="accessions">
              {(helpers) => (
                <Box as="fieldset">
                  <VisuallyHidden as="legend">Genes</VisuallyHidden>

                  <FormLabel as="p" marginTop="1rem" fontWeight="semibold">
                    Optionally filter genes
                  </FormLabel>

                  <FormikArea
                    controlProps={{
                      marginTop: '1rem',
                      marginLeft: '.5rem',
                    }}
                    focusBorderColor="orange.300"
                    name="accessionsList"
                    label="accession"
                    hideLabel
                    placeholder="List your gene accessions here, separated by a newline."
                    isDisabled={formProps.values.accessions.length > 0}
                  />

                  {formProps.values.accessions &&
                    formProps.values.accessions.length > 0 &&
                    formProps.values.accessions.map((accession, index) => (
                      <FormikAccession
                        controlProps={{
                          as: 'p',
                        }}
                        groupProps={{
                          _focusWithin: {
                            '& > button': {
                              display: 'inline-flex',
                            },
                          },
                        }}
                        isRequired
                        key={index}
                        label={`Gene Identifier ${index + 1}`}
                        name={`accessions.${index}`}
                        rightChildren={
                          // REMOVE BUTTON
                          <InputRightAddon
                            _focusWithin={{
                              backgroundColor: 'white',
                            }}
                            _hover={{
                              backgroundColor: 'white',
                            }}
                            as="span"
                            padding={0}
                          >
                            <IconButton
                              _focus={{
                                color: 'red.600',
                                outline: 'none',
                              }}
                              _groupHover={{
                                color: 'red.600',
                              }}
                              aria-label={`Remove ${accession}`}
                              color="gray.600"
                              display="flex"
                              justifyContent="center"
                              icon={<FaTrash />}
                              onClick={() => helpers.remove(index)}
                              size="md"
                              variant="unstyled"
                            />
                          </InputRightAddon>
                        }
                      >
                        {/* INSERT BUTTON */}
                        <Box
                          display="none"
                          color="gray.500"
                          _groupFocus={{
                            display: 'inline-flex',
                          }}
                          _groupHover={{
                            display: 'inline-flex',
                          }}
                          _focus={{
                            backgroundColor: 'orange.600',
                            color: 'white',
                            outline: 'none',
                          }}
                          _hover={{
                            backgroundColor: 'orange.600',
                            color: 'white',
                          }}
                          alignItems="center"
                          as="button"
                          aria-label={`Insert new below`}
                          backgroundColor="white"
                          height="1rem"
                          justifyContent="center"
                          left="43%"
                          padding=".75rem"
                          position="absolute"
                          rounded="full"
                          top="28px"
                          type="button"
                          width="1rem"
                          zIndex="popover"
                          onClick={() => helpers.insert(index + 1, '')}
                        >
                          <Icon as={FaPlus} />
                        </Box>
                      </FormikAccession>
                    ))}

                  {/* ADD NEW BUTTON */}
                  <Button
                    _focus={{
                      outline: 'none',
                      backgroundColor: 'orange.100',
                    }}
                    _hover={{
                      backgroundColor: 'orange.100',
                    }}
                    colorScheme="orange"
                    marginTop=".5rem"
                    type="button"
                    onClick={() => {
                      if (formProps.values.accessions.length === 0) {
                        helpers.push('');
                        helpers.push('');
                      } else {
                        helpers.push('');
                      }
                    }}
                    variant="ghost"
                    disabled={formProps.values.accessionsList !== ''}
                  >
                    {formProps.values.accessions.length === 0
                      ? 'Select Genes'
                      : 'Add Another Genes'}
                  </Button>
                </Box>
              )}
            </FieldArray>

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
