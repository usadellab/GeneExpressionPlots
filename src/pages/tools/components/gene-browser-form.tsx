import { Formik, Form, FieldValidator, FormikHelpers } from 'formik';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import FormikField from '@/components/formik-field';
import FormikNumber from '@/components/formik-number';
import { Flex, IconButton, InputLeftAddon, FlexProps } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

export type BrowserFormSubmitHandler = (
  values: BrowserFormAttributes,
  actions: FormikHelpers<BrowserFormAttributes>
) => void;

export interface BrowserFormProps extends Omit<FlexProps, 'onSubmit'> {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: BrowserFormSubmitHandler;
  pageMax: number;
}

export interface BrowserFormAttributes {
  searchText: string;
  countView: number;
  pageNum: number;
}

enum BrowserFormErrors {
  COUNT_EMPTY = 'The results value cannot be empty',
  COUNT_LT_ONE = 'Results cannot be less than 1',
  PAGE_EMPTY = 'The page number cannot be empty',
  PAGE_GT_MAX = 'The page number cannot be over the max',
  PAGE_LT_ONE = 'The page number cannot be less than 1',
}

const GeneBrowserForm: React.FC<BrowserFormProps> = ({
  initialFocusRef,
  onSubmit,
  pageMax,
  ...props
}) => {
  const validatePage: FieldValidator = (value: string | number) => {
    if (typeof value === 'string' && value === '')
      return BrowserFormErrors.PAGE_EMPTY;

    if (value < 1) return BrowserFormErrors.PAGE_LT_ONE;

    if (value > pageMax) return BrowserFormErrors.PAGE_GT_MAX;
  };

  const validateCount: FieldValidator = (value: string | number) => {
    if (typeof value === 'string' && value === '')
      return BrowserFormErrors.COUNT_EMPTY;

    if (value < 1) return BrowserFormErrors.COUNT_LT_ONE;
  };

  return (
    <Formik<BrowserFormAttributes>
      initialValues={{
        searchText: '',
        countView: 20,
        pageNum: 1,
      }}
      validateOnBlur={false}
      onSubmit={onSubmit}
    >
      {(formProps) => (
        <Flex as={Form} {...props}>
          <FormikField
            controlProps={{
              flexShrink: 0.7,
              marginLeft: 2,
            }}
            initialFocusRef={initialFocusRef}
            label="Search in accessions"
            leftChildren={
              <InputLeftAddon
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
                    color: 'orange.600',
                    outline: 'none',
                  }}
                  _groupHover={{
                    color: 'orange.600',
                  }}
                  aria-label="Search database"
                  color="gray.600"
                  display="flex"
                  justifyContent="center"
                  icon={<FaSearch />}
                  isLoading={formProps.isSubmitting}
                  size="md"
                  type="submit"
                  variant="unstyled"
                />
              </InputLeftAddon>
            }
            name="searchText"
          />

          <FormikNumber
            allowMouseWheel
            controlProps={{
              marginLeft: 3,
            }}
            label={`Page ${formProps.values.pageNum} / ${pageMax}`}
            name="pageNum"
            min={1}
            max={pageMax}
            validate={validatePage}
            width="100%"
          />

          <FormikNumber
            allowMouseWheel
            controlProps={{
              marginLeft: 3,
            }}
            label="Results per page"
            name="countView"
            min={1}
            validate={validateCount}
            width="100%"
          />
        </Flex>
      )}
    </Formik>
  );
};

export default GeneBrowserForm;
