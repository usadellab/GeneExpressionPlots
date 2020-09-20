import React from 'react';

import AppButton from '@components/AppButton';
import AppDrawer from '@components/AppDrawer';
import AppFile   from '@components/AppFile';

import IconFile     from '../assets/svg/hi-document.svg';
import IconDownload from '../assets/svg/hi-download.svg';

import { useDataStore } from '../store';


/**
 * @typedef {Object} DataStorageProps Properties object for the DataStorage component.
 * @property {() => void} onLoad callback after loading files
 *
 * @param {DataStorageProps} props component properties
 */
export default function DataStorage (props) {

  const { show, setShow } = props;

  const { dispatch } = useDataStore();

  /**
   * Appends the groups of an exported data file to the current store.
   * @param {React.ChangeEvent<HTMLInputElement>} event file input event
   */
  const handleLoadFile = (event) => {

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
      dispatch({
        type: 'CREATE',
        payload: {
          value: JSON.parse(fr.result),
        },
      });

      // Close drawer
      setShow(false);
    };

    fr.onerror = err => console.log(err);

  };

  return (
    <AppDrawer
      className="w-1/2 md:w-1/3 lg:w-1/4"
      show={ show }
      setShow={ setShow }
    >
      <AppFile
        className="flex justify-center m-2 primary-blue"
        onChange={ handleLoadFile }
      >
        <IconFile className="w-6 h-6 mr-3"/>
        Import Data
      </AppFile>
      <AppButton
        className="flex justify-center m-2 primary-blue"
      >
        <IconDownload className="w-6 h-6 mr-3" />
        Export Data
      </AppButton>
    </AppDrawer>
  );
}