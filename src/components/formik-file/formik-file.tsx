import { FieldValidator, useField } from 'formik';
import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

interface FormikFieldProps extends InputProps {
  initialFocusRef?: React.MutableRefObject<FocusableElement | null>;
  name: string;
  label: string;
  hideLabel?: boolean;
  validate?: FieldValidator;
}

const FormikField: React.FC<FormikFieldProps> = ({
  hideLabel,
  initialFocusRef,
  label,
  name,
  validate,
  ...props
}) => {
  const [field, meta, helpers] = useField({
    name,
    validate,
  });
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const setFormikValue: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.currentTarget.files?.item(0);
    if (file) helpers.setValue(file);
  };

  /**
   * On pressing the Space key, trigger the hidden file input click event.
   * @param event keyboard event
   */
  const onKeyDownTriggerInputClick: React.KeyboardEventHandler<HTMLInputElement> =
    (event) => {
      if (event.key === ' ') {
        triggerHiddenInputClick();
      }
    };

  /**
   * On pressing the main mouse button, trigger the hidden file input click event.
   * @param event mouse event
   */
  const onMouseDownTriggerInputClick: React.MouseEventHandler<HTMLInputElement> =
    (event) => {
      if (event.button === 0) triggerHiddenInputClick();
    };

  /**
   * Trigger the hidden input click event
   */
  const triggerHiddenInputClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <FormControl
      as="p"
      isInvalid={meta.error !== undefined && meta.touched !== undefined}
      isRequired={props.isRequired}
      isReadOnly
    >
      {hideLabel ? (
        <VisuallyHidden>
          <FormLabel fontWeight="semibold">{label}</FormLabel>
        </VisuallyHidden>
      ) : (
        <FormLabel fontWeight="semibold">{label}</FormLabel>
      )}

      {/*
        Visible Read-Only Text Input
        - We override the value property that we receive in field.value (typeof File),
          to only display the file name.
        - On click, we trigger the click() event of the hidden input below.
      */}
      <Input
        {...field}
        {...props}
        ref={(ref) => (initialFocusRef ? (initialFocusRef.current = ref) : ref)}
        onMouseDown={onMouseDownTriggerInputClick}
        onKeyDown={onKeyDownTriggerInputClick}
        placeholder="Select a file to load"
        onChange={(event) => event}
        value={(field.value as File)?.name ?? ''}
      />

      {/*
        Hidden File Input
        - We hijack the Formik setValue helper to send the correct File object,
          instead of the name or fakePath property (depends on the browser).
      */}
      <Input
        ref={(ref) => (fileInputRef.current = ref)}
        hidden
        id={`hidden-${field.name}`}
        name={`hidden-${field.name}`}
        type="file"
        onChange={setFormikValue}
      />

      <FormErrorMessage as="span">{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikField;
