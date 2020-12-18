import React from 'react';

import AppButton  from '@components/AppButton';
import AppIcon    from '@components/AppIcon';
import AppFile    from '@components/AppFile';
import AppSelect  from '@components/AppSelect';
import AppSpinner from '@components/AppSpinner';
import AppText    from '@components/AppText';

import { store } from '@/store';
import { readExpressionTable } from '@/utils/parser';


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

  onFieldSeparatorChange = (event) => {
    this.setState({ fieldSeparator: event.target.value });
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

    const reader = new FileReader();

    reader.onload = () => {
      const spaghetti = readExpressionTable(reader.result, {
        captionsColumn: this.state.captionsColumn,
        headerSeparator: this.state.headerSeparator,
        countUnit: this.state.countUnit,
        fieldSeparator: this.state.fieldSeparator,
      });
      store.assignData(Object.values(spaghetti));
    };

    reader.onprogress = progress => {

      // console.log(progress);
    };

    reader.onloadend = () => {

      // store.checkAndAddReplicates(this.state, replicates);
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

        <AppSelect
          className="w-full"
          placeholder="1..N"
          label="Field separator"
          value={ this.state.separator }
          options={[
            { label: 'CSV',  value: ','  },
            { label: 'TAB',  value: '\t' },
          ]}
          onChange={ this.onFieldSeparatorChange }
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