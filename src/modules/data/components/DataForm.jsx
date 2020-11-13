import React from 'react';

import AppButton  from '@components/AppButton';
import AppFile    from '@components/AppFile';
import AppIcon    from '@components/AppIcon';
import AppSpinner from '@components/AppSpinner';


export default class DataForm extends React.Component {

  constructor () {
    super();
    this.state = {
      loading: false,
      cancel: true,
    };
  }

  /**
   * Submit new or updated group to the store. Navigate to DataView page.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onFormSubmit = async (event) => {

    event.preventDefault();

    const { separator, header, accessionColumn, countColumn } = this.state;

    this.setState({ loading: true });

    const files = [ ...event.target.files ];

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

  /**
   * Cancel the current form submission and execute the onCancel callback.
   */
  onCancelButtonClick = () => {
    this.setState({ cancel: true });
    this.props.onCancel();
  }

  render () {
    return (
      <form className="w-full px-6 flex-auto my-4 text-gray-600 text-lg leading-relaxed">

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