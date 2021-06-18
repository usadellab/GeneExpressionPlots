import {
  Formik,
  Form,
  FieldArray,
  FieldValidator,
  FormikHelpers,
} from 'formik';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import FormikField from '@/components/formik-field';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  InputRightAddon,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

export interface BarsFormAttributes {
  plotTitle: string;
  accessions: string[];
}

export type BarsFormSubmitHandler = (
  values: BarsFormAttributes,
  actions: FormikHelpers<BarsFormAttributes>
) => void;

export interface BarsFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: BarsFormSubmitHandler;
}

const BarsForm: React.FC<BarsFormProps> = (props) => {
  const validateAccession: FieldValidator = (value: string) => {
    if (!value) return 'The accession ID cannot be empty';
  };

  return (
    <Formik
      initialValues={{ plotTitle: '', accessions: [''] }}
      onSubmit={props.onSubmit}
    >
      {(formProps) => (
        <Form>
          <FormikField
            label="Plot Title"
            name="plotTitle"
            initialFocusRef={props.initialFocusRef}
          />
          <FieldArray name="accessions">
            {(helpers) => (
              <Box as="section">
                <VisuallyHidden>
                  <Text as="h1" fontWeight="semibold">
                    Gene Accessions
                  </Text>
                </VisuallyHidden>
                {formProps.values.accessions &&
                  formProps.values.accessions.length > 0 &&
                  formProps.values.accessions.map((accession, index) => (
                    <Flex
                      alignItems="center"
                      key={index}
                      _first={{
                        marginTop: '1rem',
                      }}
                      paddingBottom="1rem"
                      role="group"
                    >
                      <FormikField
                        groupProps={{
                          _focusWithin: {
                            '& > button': {
                              display: 'inline-flex',
                            },
                          },
                        }}
                        isRequired
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
                      </FormikField>
                    </Flex>
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
                  type="button"
                  variant="ghost"
                  onClick={() => helpers.push('')}
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
        </Form>
      )}
    </Formik>
  );
};

export default BarsForm;
