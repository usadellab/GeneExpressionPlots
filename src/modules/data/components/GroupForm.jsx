import React from 'react';

import AppButton from '@components/AppButton';
import AppFile   from '@components/AppFile';
import AppIcon   from '@components/AppIcon';
import AppSwitch from '@components/AppSwitch';
import AppSelect from '@components/AppSelect';
import AppSpinner from '@components/AppSpinner';
import AppText   from '@components/AppText';

import { store } from '@/store';

import { parseCsv } from '../../../utils/fileHelper';


/**
 * Render a single group as a JSX.Element
 *
 * @typedef  {Object} GroupViewProps Properties object for the GroupVIew component.
 * @property {string} className css classes to apply in the root element
 *
 * @param {GroupViewProps} props component props
 */
export default class GroupView extends React.Component {

  constructor () {

    super();

    this.state = {
      groupName: '',
      countUnit: 'raw',
      // Sample
      sampleName: '',
      xTickValue: 0,
      // Replicate
      accessionColumn: 0,
      countColumn: 0,
      header: true,
      separator: '',
      // Component
      cancel: false,
      loading: false,
    };

  }

  /* EVENT HANDLERS */

  /**
   * Submit new or updated group to the store. Navigate to DataView page.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onFormSubmit = async (event) => {

    event.preventDefault();

    const { separator, header, accessionColumn, countColumn } = this.state;

    this.setState({ loading: true });

    const files = [ ...event.target.files ];

    // const file = event.target.files[0];

    // const reader = new FileReader();

    // reader.onload = () => console.log(
    //   // reader.result.length
    //   'done'
    // );

    // reader.onprogress = progress => {

    //   console.log(progress);
    // };

    // reader.onloadend = () => {

    //   this.setState({ loading: false });
    // };

    // reader.readAsText(file);

    let replicates = await Promise.all(

      files.map((replicate) => parseCsv(replicate, {
        separator,
        header,
        accessionColumn,
        countColumn,
      }))

    );

    store.checkAndAddReplicates(this.state, replicates);
    this.setState({ loading: false });
    this.props.onSave();
  }

  /* ACTION HANDLERS */

  /**
   * Updates the state with the header property value.
   * @param {boolean} value switch on/off state
   */
  onHeaderSwitchClick = (value) => this.setState({
    header: value
  });

  /**
   * Cancel the current form submission and execute the onCancel callback.
   */
  onCancelButtonClick = () => {
    this.setState({ cancel: true });
    this.props.onCancel();
  }

  render () {

    return (
      <form
        className={
          `w-full ${this.props.className || ''}`
        }
        // onSubmit={ this.onFormSubmit }
      >

        {/* GROUP */}
        <div className="flex flex-col md:flex-row" >

          {/* GROUP NAME */}
          <AppText
            className="w-full md:w-1/2"
            label="Group name"
            value={ this.state.groupName }
            onChange={ (event) => this.setState({ groupName: event.target.value }) }
          />

          {/* COUNT UNIT */}
          <AppSelect
            className="w-full md:w-1/2 md:ml-2"
            label="Count unit"
            value={ this.state.countUnit }
            options={[
              { label: 'Raw',  value: 'raw' },
              { label: 'RPKM', value: 'rpkm' },
              { label: 'TPM',  value: 'tpm' }
            ]}
            onChange={ (event) => this.setState({ countUnit: event.target.value }) }
          />

        </div>


        {/* SAMPLE */}
        <div className="flex flex-col md:flex-row mt-4">

          {/* NAME */}
          <AppText
            className="w-full md:w-1/2"
            placeholder="e.g. DAS-1"
            label="Sample name"
            value={ this.state.sampleName }
            onChange={ (event) => this.setState({ sampleName: event.target.value }) }
          />

          {/* X-VALUE */}
          <AppText
            className="w-full md:w-1/2 md:ml-2"
            placeholder="1..N"
            label="Sample X-value"
            value={ this.state.xTickValue }
            onChange={ (event) => this.setState({ xTickValue: event.target.value }) }
          />

        </div>


        {/* REPLICATES */}
        <div className="flex flex-col justify-center md:flex-row mt-4" >

          {/* COLUMN separator */}
          <AppSelect
            className="w-full md:w-1/3"
            placeholder="1..N"
            label="separator"
            value={ this.state.separator }
            options={[
              { label: 'Auto', value: ''   },
              { label: 'TAB',  value: '\t' },
              { label: 'CSV',  value: ','  }
            ]} onChange={ (event) => this.setState({ separator: event.target.value }) }
          />

          {/* GENE ID COLUMN */}
          <AppText
            className="w-full md:w-1/3 md:ml-2"
            placeholder="1..N"
            label="Gene ID column"
            value={ this.state.accessionColumn }
            onChange={ (event) => this.setState({ accessionColumn: event.target.value }) }
          />

          {/* COUNT COLUMN */}
          <AppText
            className="w-full md:w-1/3 md:ml-2"
            placeholder="1..N"
            label="Expression count column"
            value={ this.state.countColumn }
            onChange={ (event) => this.setState({ countColumn: event.target.value }) }
          />

        </div>

        <div className="flex flex-col justfify-center items-center mt-4 md:flex-row" >

          {/* HEADER TOGGLE */}
          <AppSwitch
            className="w-full md:w-1/4 md:ml-2"
            label="Header Row"
            checked={ this.state.header }
            onChange={ this.onHeaderSwitchClick }
          />

        </div>


        {/* FORM ACTIONS */}

        <div className="flex mt-6 mx-1">

          <AppFile
            className="flex justify-center items-center py-2 px-5 primary-blue"
            multiple
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
                : 'Upload Tables'
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