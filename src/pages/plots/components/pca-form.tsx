import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';
import FormikField from '@/components/formik-field';
import { Box, Button, Flex } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

export type PCAFormSubmitHandler = (
  values: PCAFormAttributes,
  actions: FormikHelpers<PCAFormAttributes>
) => void;

export interface PCAFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: PCAFormSubmitHandler;
}

interface PCAFormAttributes {
  plotTitle: string;
}

const PCAForm: React.FC<PCAFormProps> = (props) => {
  return (
    <Formik<PCAFormAttributes>
      initialValues={{
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
              marginTop: '1rem',
            }}
            initialFocusRef={props.initialFocusRef}
            label="Plot Title"
            name="plotTitle"
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

export default PCAForm;
