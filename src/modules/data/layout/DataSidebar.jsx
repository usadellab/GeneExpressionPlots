import React, { Fragment } from 'react';

import AppButton from '@components/AppButton';
import AppDrawer from '@components/AppDrawer';
import AppFile   from '@components/AppFile';

import IconLeft     from '@assets/svg/hi-chevron-left.svg';
import IconFile     from '@assets/svg/hi-document.svg';
import IconDownload from '@assets/svg/hi-download.svg';

import { store } from '@/store';


/**
 * @typedef {Object} DataStorageProps Properties object for the DataStorage component.
 * @property {() => void} onLoad callback after loading files
 *
 * @param {DataStorageProps} props component properties
 */
export default class DataStorage extends React.Component {

  constructor () {
    super();
    this.state = {
      show: false
    };
  }

  /**
   * Appends the groups of an exported data file to the current store.
   * @param {React.ChangeEvent<HTMLInputElement>} event file input event
   */
  handleLoadFile = (event) => {

    // Get the file ref
    const file = event.target.files.item(0);

    // Reset file input (allow consecutive uploads of the same file)
    event.target.value = null;

    // Accept JSON mime-type only
    if (!file || file.type !== 'application/json') return;

    // Use FileReader API to parse the input file
    const fr = new FileReader();

    fr.readAsText(file, 'utf-8');

    fr.onload = () => {

      // Update store
      store.groups.push( ...JSON.parse(fr.result) );

      // Close drawer
      this.setState({ show: false });
    };

    fr.onerror = err => console.log(err);

  };

  render () {
    return (
      <Fragment>
        <nav
          className="fixed right-0 py-4
                   flex flex-col items-center justify-center h-full
                   bg-gray-400"
        >
          <AppButton
            className="rounded-full h-full"
            onClick={ () => this.setState({ show: true }) }
          >
            <IconLeft className="w-6 h-6 text-white" />
          </AppButton>

        </nav>
        <AppDrawer
          className="z-50 w-1/2 md:w-1/3 lg:w-1/4"
          show={ this.state.show }
          setShow={ () => this.setState({ show: false }) }
        >
          <AppFile
            className="flex justify-center m-2 py-2 px-5 primary-blue"
            onChange={ this.handleLoadFile }
          >
            <IconFile className="w-6 h-6 mr-3"/>
          Import Data
          </AppFile>
          <AppButton
            className="flex justify-center m-2 py-2 px-5 primary-blue"
          >
            <IconDownload className="w-6 h-6 mr-3" />
          Export Data
          </AppButton>
        </AppDrawer>
      </Fragment>
    );
  }
}