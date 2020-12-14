import React from 'react';

import AppButton  from '@components/AppButton';
import AppIcon    from '@components/AppIcon';
import AppFile    from '@components/AppFile';
import AppSelect  from '@components/AppSelect';
import AppSpinner from '@components/AppSpinner';
import AppText    from '@components/AppText';

import { readTable } from '@/utils/parser';

export default class TableForm extends React.Component {

  constructor () {
    super();
    this.state = {
      headerSeparator: '*',
      countUnit: 'raw',
      captionsColumn: '',
      //
      fieldSeparator: ',',
      //
      cancel: false,
      loading: false,
    };
  }

  /* INPUT HANDLERS */

  onCaptionColumnChange = (event) => {
    this.setState({ captionsColumn: event.target.value });
  }

  onCountUnitSelect = (event) => {
    this.setState({ countUnit: event.target.value });
  }

  onHeaderSeparatorChange = (event) => {
    this.setState({ headerSeparator: event.target.value });
  }

  /* ACTION HANDLERS */

  /**
   * Submit new or updated group to the store. Navigate to DataView page.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onFormSubmit = async (event) => {

    event.preventDefault();

    this.setState({ loading: true });

    const file = event.target.files[0];

    // Accept tabular types only
    const validTypes = [
      'text/tab-separated-values',
      'text/csv',
      'text/plain',
    ];

    if (!file || !validTypes.includes(file.type)) {
      console.error(`Invalid file type: ${file.type}`);
      this.setState({ loading: false });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const table = readTable(reader.result, {
        fieldSeparator: '\t'
      });
      console.log(table);
    };

    reader.onloadend = () => {
      this.setState({ loading: false });
      this.props.onSave();
    };

    reader.readAsText(file);

  }

  onCancelButtonClick = () => {
    this.setState({ cancel: true });
    this.props.onCancel();
  }

  render () {
    return (
      <form className="w-full px-6 flex-auto my-4 text-gray-600 text-lg leading-relaxed">

        <AppSelect
          className="w-full"
          label="Count unit"
          value={ this.state.countUnit }
          options={[
            { label: 'Raw',  value: 'raw' },
            { label: 'RPKM', value: 'rpkm' },
            { label: 'TPM',  value: 'tpm' }
          ]}
          onChange={ this.onCountUnitSelect }
        />

        <AppText
          className="w-full"
          label="Header separator"
          value={ this.state.headerSeparator }
          onChange={ this.onHeaderSeparatorChange }
        />

        <AppText
          className="w-full"
          label="Captions column"
          value={ this.state.captionsColumn }
          onChange={ this.onCaptionColumnChange }
        />

        {/* FORM ACTIONS */}

        <div className="flex mt-6 mx-1">

          <AppFile
            className="flex justify-center items-center py-2 px-5 primary-blue"
            onChange={ this.onFormSubmit }
          >
            {
              this.state.loading
                ? <AppSpinner className="mr-3 h-6 w-6 text-white" />
                : <AppIcon file="hero-icons" id="document" className="w-6 h-6 mr-3"/>
            }
            {
              this.state.loading
                ? 'Uploading'
                : 'Upload Table'
            }
          </AppFile>

          <AppButton
            className="ml-3 py-2 px-5 tertiary-pink"
            type="button"
            value="Cancel"
            onClick={ this.onCancelButtonClick }
          >
              Cancel
          </AppButton>
        </div>

      </form>
    );
  }
}