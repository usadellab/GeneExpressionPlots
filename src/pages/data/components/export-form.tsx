import FormikField from '@/components/formik-field';
import FormikSwitch from '@/components/formik-switch';
import { settings } from '@/store/settings';
import { escapeDelimiters } from '@/utils/string';
import { Box, Flex, Button } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';
import {
  FieldValidator,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import React from 'react';

export interface ExportGXPFormAttributes {
  columnSep: string;
  fileName: string;
  exportPlots: boolean;
  exportEnrichments: boolean;
}

export type ExportGXPFormSubmitHandler = (
  values: ExportGXPFormAttributes,
  actions: FormikHelpers<ExportGXPFormAttributes>
) => void;

export interface ExportGXPFormProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  onCancel?: () => void;
  onSubmit: ExportGXPFormSubmitHandler;
  children?:
    | React.ReactNode
    | ((formProps: FormikProps<ExportGXPFormAttributes>) => React.ReactNode);
}

const ExportGXPForm: React.FC<ExportGXPFormProps> = (props) => {
  const validateFileName: FieldValidator = (value: File) => {
    if (!value) return 'A file name is required';
  };

  const validateSeparator: FieldValidator = (value: string) => {
    let error;

    if (!value) {
      error = 'A separator value is required';
    } else if ((value.length > 1 && value[0] !== '\\') || value.length > 2) {
      error =
        'Separators must be one character long' +
        ' (escaped characters are supported)';
    }

    return error;
  };

  return (
    <Formik
      initialValues={{
        columnSep: escapeDelimiters(settings.gxpSettings.expression_field_sep),
        fileName: 'GXP_Database',
        exportPlots: false,
        exportEnrichments: false,
      }}
      onSubmit={props.onSubmit}
      validateOnBlur={false}
    >
      {(formProps) => (
        <Box
          as={Form}
          id="export-gxp-db"
          sx={{
            '& p:not(:first-of-type)': {
              marginTop: '1rem',
            },
          }}
        >
          <FormikField
            initialFocusRef={props.initialFocusRef}
            name="columnSep"
            label="Column Separator"
            validate={validateSeparator}
            isRequired
          />

          <FormikField
            name="fileName"
            label="File Name"
            validate={validateFileName}
            isRequired
          />

          <FormikSwitch
            controlProps={{
              marginTop: '1rem',
            }}
            color="orange.600"
            id="export-plots"
            name="exportPlots"
            label="Export Plots"
          />

          <FormikSwitch
            controlProps={{
              marginTop: '1rem',
            }}
            color="orange.600"
            id="export-enrichments"
            name="exportEnrichments"
            label="Export Enrichments"
          />

          {!props.children ? (
            <Flex as="p" paddingY={6} justifyContent="flex-end">
              <Button onClick={props.onCancel} variant="ghost">
                Cancel
              </Button>
              <Button
                colorScheme="orange"
                isLoading={formProps.isSubmitting}
                marginLeft=".5rem"
                type="submit"
                variant="solid"
              >
                Export
              </Button>
            </Flex>
          ) : typeof props.children === 'function' ? (
            props.children(formProps)
          ) : (
            props.children
          )}
        </Box>
      )}
    </Formik>
  );
};

export default ExportGXPForm;

{
  /* <FormControl>
            <FormLabel>Count Unit</FormLabel>
            <Input
              ref={(ref) => (initialRef.current = ref)}
              list="count-units"
            />
            <datalist id="count-units">
              <option value="Raw" />
              <option value="TPM" />
              <option value="FPKM" />
              <option value="RPKM" />
              <option value="RPM" />
              <option value="CPM" />
              <option value="TMM" />
              <option value="DESeq" />
              <option value="GeTMM" />
              <option value="SCnorm" />
              <option value="ComBat-Seq" />
            </datalist>
          </FormControl>

          <FormControl>
            <FormLabel>Header Separator</FormLabel>
            <Input defaultValue="*" />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Column Separator</FormLabel>
            <Input defaultValue="\t" list="column-seps" />
            <datalist id="column-seps">
              <option value="\t">tab-separated</option>
              <option value=",">comma-separated</option>
            </datalist>
          </FormControl>
          */
}
