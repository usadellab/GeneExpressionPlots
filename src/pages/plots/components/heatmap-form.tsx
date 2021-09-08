import {
  Formik,
  Form,
  FieldArray,
  FieldValidator,
  FormikErrors,
  FormikHelpers,
} from 'formik';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import FormikField from '@/components/formik-field';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  CloseButton,
  Flex,
  Icon,
  IconButton,
  InputRightAddon,
  VisuallyHidden,
  FormLabel,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import FormikRadio from '@/components/formik-radio';
import FormikReplicate from '@/components/formik-replicate';
import FormikAccession from '@/components/formik-accession';
import FormikSelect from '@/components/formik-select';
import { GXPDistanceMethod } from '@/utils/plots/heatmap';
import FormikArea from '@/components/formik-area';

export type HeatmapFormSubmitHandler = (
  values: HeatmapFormAttributes,
  actions: FormikHelpers<HeatmapFormAttributes>
) => void;

export interface HeatmapFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: HeatmapFormSubmitHandler;
}

export interface HeatmapFormAttributes {
  accessions: string[];
  accessionsList: string;
  clusterBy: 'replicates' | 'genes';
  distanceMethod: GXPDistanceMethod;
  replicates: string[];
  replicatesList: string;
  plotTitle?: string;
}

enum HeatmapFormErrors {
  EMPTY_REPLICATE = 'A replicate field cannot be empty',
  EMPTY_ACCESSION = 'A gene accession field cannot be empty',
  MIN_OPTIONAL_REPLICATES = 'At least two replicates must be selected',
  MIN_OPTIONAL_ACCESSIONS = 'At least two genes must be selected',
}

const HeatmapForm: React.FC<HeatmapFormProps> = (props) => {
  const validateForm = (
    values: HeatmapFormAttributes
  ): FormikErrors<HeatmapFormAttributes> | void => {
    if (values.replicates.length === 1 && values.clusterBy === 'replicates') {
      return {
        replicates: [HeatmapFormErrors.MIN_OPTIONAL_REPLICATES],
      };
    }
    if (values.accessions.length === 1 && values.clusterBy === 'genes') {
      return {
        accessions: [HeatmapFormErrors.MIN_OPTIONAL_ACCESSIONS],
      };
    }
  };

  const validateReplicate: FieldValidator = (value: string) => {
    if (!value) return HeatmapFormErrors.EMPTY_REPLICATE;
  };

  const validateAccession: FieldValidator = (value: string) => {
    if (!value) return HeatmapFormErrors.EMPTY_ACCESSION;
  };

  return (
    <Formik<HeatmapFormAttributes>
      initialValues={{
        accessions: [],
        accessionsList: '',
        clusterBy: 'replicates',
        distanceMethod: 'correlation',
        replicates: [],
        replicatesList: '',
        plotTitle: '',
      }}
      validateOnBlur={false}
      validate={validateForm}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <>
          {formProps.errors.replicates?.[0] ===
            HeatmapFormErrors.MIN_OPTIONAL_REPLICATES && (
            <VisuallyHidden>
              <Alert status="error" variant="subtle" alignItems="center">
                <AlertIcon mr={4} />
                <Box flex="1">
                  <AlertTitle fontSize="lg">Errors</AlertTitle>
                  <AlertDescription display="block">
                    {HeatmapFormErrors.MIN_OPTIONAL_REPLICATES}
                  </AlertDescription>
                </Box>
                <CloseButton position="absolute" right="8px" top="8px" />
              </Alert>
            </VisuallyHidden>
          )}

          <Box as={Form}>
            <FormikField
              controlProps={{
                as: 'p',
                marginTop: '1rem',
              }}
              initialFocusRef={props.initialFocusRef}
              label="Plot Title"
              name="plotTitle"
            />

            <FormikSelect
              controlProps={{
                marginTop: '2rem',
              }}
              label="Likelihood measure"
              name="distanceMethod"
              options={[
                { value: 'correlation', label: 'correlation' },
                { value: 'euclidean', label: 'euclidean distance' },
              ]}
            />

            <FormikRadio
              controlProps={{
                marginTop: '2rem',
              }}
              label="Cluster"
              name="clusterBy"
              options={[
                { label: 'Replicates', value: 'replicates' },
                { label: 'Genes', value: 'genes' },
              ]}
              direction="row"
            />
            <FieldArray name="replicates">
              {(helpers) => (
                <Box as="fieldset">
                  <VisuallyHidden as="legend">Replicates</VisuallyHidden>
                  <FormLabel as="p" marginTop="2rem" fontWeight="semibold">
                    Optionally filter replicates
                  </FormLabel>

                  <FormikArea
                    controlProps={{
                      marginTop: '1rem',
                      marginLeft: '.5rem',
                    }}
                    focusBorderColor="orange.300"
                    name="replicatesList"
                    label="replicates"
                    hideLabel
                    placeholder="List your replicates here, separated by a newline."
                    isDisabled={formProps.values.replicates.length > 0}
                  />

                  {formProps.values.replicates.length > 0 &&
                    formProps.values.replicates.map((replicate, index) => (
                      <FormikReplicate
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
                        label={`Replicate ${index + 1}`}
                        name={`replicates.${index}`}
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
                              aria-label={`Remove ${replicate}`}
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
                        validate={validateReplicate}
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
                      </FormikReplicate>
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
                    // backgroundColor="orange.100"
                    // textColor="orange.600"
                    type="button"
                    onClick={() => {
                      if (formProps.values.replicates.length === 0) {
                        helpers.push('');
                        helpers.push('');
                      } else {
                        helpers.push('');
                      }
                    }}
                    variant="ghost"
                    marginTop="1rem"
                    disabled={formProps.values.replicatesList !== ''}
                  >
                    {formProps.values.replicates.length === 0
                      ? 'Select Replicates'
                      : 'Add Another Replicate'}
                  </Button>
                </Box>
              )}
            </FieldArray>

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
                    marginTop="1rem"
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
                Load
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </Formik>
  );
};

export default HeatmapForm;
