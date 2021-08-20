import {
  Formik,
  Form,
  FormikHelpers,
  FieldValidator,
  FormikErrors,
  FieldArray,
} from 'formik';
import React from 'react';
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
import FormikRadio from '@/components/formik-radio';
import FormikReplicate from '@/components/formik-replicate';
import { FaTrash, FaPlus } from 'react-icons/fa';
import FormikAccession from '@/components/formik-accession';

export type PCAFormSubmitHandler = (
  values: PCAFormAttributes,
  actions: FormikHelpers<PCAFormAttributes>
) => void;

export interface PCAFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: PCAFormSubmitHandler;
}

export interface PCAFormAttributes {
  accessions: string[];
  calculateFor: 'replicates' | 'genes';
  replicates: string[];
  plotTitle?: string;
}

enum PCAFormErrors {
  EMPTY_REPLICATE = 'A replicate field cannot be empty',
  EMPTY_ACCESSION = 'A gene accession field cannot be empty',
  MIN_OPTIONAL_REPLICATES = 'At least two replicates must be selected',
  MIN_OPTIONAL_ACCESSIONS = 'At least two genes must be selected',
}

const PCAForm: React.FC<PCAFormProps> = (props) => {
  const validateForm = (
    values: PCAFormAttributes
  ): FormikErrors<PCAFormAttributes> | void => {
    if (
      values.replicates.length === 1 &&
      values.calculateFor === 'replicates'
    ) {
      return {
        replicates: [PCAFormErrors.MIN_OPTIONAL_REPLICATES],
      };
    }
    if (values.accessions.length === 1 && values.calculateFor === 'genes') {
      return {
        accessions: [PCAFormErrors.MIN_OPTIONAL_ACCESSIONS],
      };
    }
  };

  const validateReplicate: FieldValidator = (value: string) => {
    if (!value) return PCAFormErrors.EMPTY_REPLICATE;
  };

  const validateAccession: FieldValidator = (value: string) => {
    if (!value) return PCAFormErrors.EMPTY_ACCESSION;
  };

  return (
    <Formik<PCAFormAttributes>
      initialValues={{
        accessions: [],
        calculateFor: 'replicates',
        replicates: [],
        plotTitle: '',
      }}
      validateOnBlur={false}
      validate={validateForm}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
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

          <FormikRadio
            controlProps={{
              marginTop: '1rem',
            }}
            label="Calculate For"
            name="calculateFor"
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

                {formProps.values.replicates.length > 0 &&
                  formProps.values.replicates.map((replicate, index) => (
                    <FormikReplicate
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
                  marginTop="1rem"
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
                >
                  {formProps.values.replicates.length === 0
                    ? 'Optional: Select Replicates'
                    : 'Add Another Replicate'}
                </Button>
              </Box>
            )}
          </FieldArray>

          <FieldArray name="accessions">
            {(helpers) => (
              <Box as="fieldset">
                <VisuallyHidden as="legend">Genes</VisuallyHidden>

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
                >
                  {formProps.values.accessions.length === 0
                    ? 'Optional: Select Genes'
                    : 'Add Another Genes'}
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

export default PCAForm;
