import React from 'react';

import AppDrawer from '@components/AppDrawer';
import AppFile   from '@components/AppFile';
import IconFile  from '../assets/svg/hi-document.svg';

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

    const file = event.target.files.item(0);

    if (!file || file.type !== 'application/json') return;

    const fr = new FileReader();

    fr.readAsText(file, 'utf-8');

    fr.onload = () => {

      const value = JSON.parse(fr.result);

      dispatch({
        type: 'CREATE',
        payload: {
          value,
        },
      });

      setShow(false);
    };
  };

  return (
    <AppDrawer
      className="w-1/2"
      show={ show }
      setShow={ setShow }
    >
      <AppFile
        className="flex justify-center m-2 primary-blue"
        onChange={ handleLoadFile }
      >
        <IconFile className="w-6 h-6 mr-3"/>
        Load File
      </AppFile>
    </AppDrawer>
  );
}