import {
  Formik,
  Form,
  FieldArray,
  FieldValidator,
  FormikHelpers,
} from 'formik';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import FormikAccession from '@/components/formik-accession';
import FormikField from '@/components/formik-field';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  InputRightAddon,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikSwitch from '@/components/formik-switch';
import { dataTable } from '@/store/data-store';

export interface StackedLinesAttributes {
  accessions: string[];
  plotTitle: string;
  withCaption: boolean;
  withLegend: boolean;
}

export type StackedLinesFormSubmitHandler = (
  values: StackedLinesAttributes,
  actions: FormikHelpers<StackedLinesAttributes>
) => void;

export interface StackedLinesFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: StackedLinesFormSubmitHandler;
}

const StackedLinesForm: React.FC<StackedLinesFormProps> = (props) => {
  const validateAccession: FieldValidator = (value: string) => {
    const row = dataTable.getRow(value);
    if (!row) return 'The accession ID does not exist';
    if (!value) return 'The accession ID cannot be empty';
  };

  return (
    <Formik
      initialValues={{
        accessions: [''],
        plotTitle: '',
        withCaption: true,
        withLegend: true,
      }}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <Box as={Form}>
          <Box as="fieldset">
            <VisuallyHidden as="legend">
              Legend and caption switches
            </VisuallyHidden>

            <Flex as="ul" listStyleType="none">
              <FormikSwitch
                controlProps={{
                  as: 'li',
                }}
                color="orange.600"
                id="plot-legend"
                label="Legend"
                name="withLegend"
              />

              <FormikSwitch
                controlProps={{
                  as: 'li',
                }}
                color="orange.600"
                id="plot-caption"
                label="Caption"
                name="withCaption"
              />
            </Flex>
          </Box>

          <FormikField
            controlProps={{
              as: 'p',
              marginTop: '1rem',
            }}
            initialFocusRef={props.initialFocusRef}
            label="Plot Title"
            name="plotTitle"
          />

          <FieldArray name="accessions">
            {(helpers) => (
              <Box as="fieldset">
                <VisuallyHidden as="legend">Gene Accessions</VisuallyHidden>

                {formProps.values.accessions &&
                  formProps.values.accessions.length > 0 &&
                  formProps.values.accessions.map((accession, index) => (
                    <FormikAccession
                      controlProps={{
                        as: 'p',
                        marginTop: '1rem',
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
                      label={`Gene Accession ${index + 1}`}
                      name={`accessions.${index}`}
                      rightChildren={
                        formProps.values.accessions.length > 1 && (
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
                        )
                      }
                      validate={validateAccession}
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

                <Button
                  _focus={{
                    outline: 'none',
                    backgroundColor: 'orange.100',
                  }}
                  _hover={{
                    backgroundColor: 'orange.100',
                  }}
                  colorScheme="orange"
                  marginTop="1rem"
                  type="button"
                  onClick={() => helpers.push('')}
                  variant="ghost"
                >
                  Add New
                </Button>
              </Box>
            )}
          </FieldArray>

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

export default StackedLinesForm;
