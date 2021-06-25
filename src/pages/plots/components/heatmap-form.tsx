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
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

export type HeatmapFormSubmitHandler = (
  values: HeatmapFormAttributes,
  actions: FormikHelpers<HeatmapFormAttributes>
) => void;

export interface HeatmapFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: HeatmapFormSubmitHandler;
}

interface HeatmapFormAttributes {
  replicates: string[];
  plotTitle: string;
}

enum HeatmapFormErrors {
  EMPTY_REPLICATE = 'A replicate field cannot be empty',
  MIN_REPLICATES = 'At least two replicates must be selected',
}

const HeatmapForm: React.FC<HeatmapFormProps> = (props) => {
  const validateForm = (
    values: HeatmapFormAttributes
  ): FormikErrors<HeatmapFormAttributes> | void => {
    if (values.replicates.length === 1) {
      return {
        replicates: [HeatmapFormErrors.MIN_REPLICATES],
      };
    }
  };

  const validateReplicate: FieldValidator = (value: string) => {
    if (!value) return HeatmapFormErrors.EMPTY_REPLICATE;
  };

  return (
    <Formik<HeatmapFormAttributes>
      initialValues={{
        replicates: [],
        plotTitle: '',
      }}
      validateOnBlur={false}
      validate={validateForm}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <>
          {formProps.errors.replicates?.[0] ===
            HeatmapFormErrors.MIN_REPLICATES && (
            <VisuallyHidden>
              <Alert status="error" variant="subtle" alignItems="center">
                <AlertIcon mr={4} />
                <Box flex="1">
                  <AlertTitle fontSize="lg">Errors</AlertTitle>
                  <AlertDescription display="block">
                    {HeatmapFormErrors.MIN_REPLICATES}
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

            <FieldArray name="replicates">
              {(helpers) => (
                <Box as="fieldset">
                  <VisuallyHidden as="legend">Replicates</VisuallyHidden>

                  {formProps.values.replicates.length > 0 &&
                    formProps.values.replicates.map((accession, index) => (
                      <FormikField
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
                      </FormikField>
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
