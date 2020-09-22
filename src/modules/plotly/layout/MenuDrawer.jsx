import React, { useState } from 'react';

import AppButton   from '@components/AppButton';
import AppCheckbox from '@components/AppCheckbox';
import AppDrawer   from '@components/AppDrawer';
import AppSelect   from '@components/AppSelect';

import { usePlotStore } from '../store/context';

/**
 * @typedef {Object} DataStorageProps Properties object for the DataStorage component.
 * @property {() => void} onLoad callback after loading files
 *
 * @param {DataStorageProps} props component properties
 */
export default function DataStorage (props) {

  const { show, setShow } = props;
  const ACC = [ 'PGSC0003DMT400039136', 'PGSC0003DMT400039134', 'PGSC0003DMT400039133' ];

  const { dispatch } = usePlotStore();

  const [ accession, setAccession ] = useState(ACC[0]);
  const [ showlegend, setShowlegend ] = useState(false);

  // console.log(state[0]);

  /**
   * Submit a new plot to the store.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  const handleSubmit = (event) => {

    // Update the plots store
    dispatch({
      type: 'CREATE_PLOT',
      payload: {
        accession,
        showlegend,
      }
    });

    // Close the drawer
    setShow(false);

    // Prevent default form submit event
    event.preventDefault();
  };

  const handleReset = (event) => {

    dispatch({
      type: 'RESET_PLOTS',
    });

    setShow(false);

  };

  return (
    <AppDrawer
      className="z-50 p-3 w-1/2 md:w-1/3 lg:w-1/4"
      show={ show }
      setShow={ setShow }
    >
      <form className="flex flex-col w-full">

        <AppSelect
          className="w-full"
          label="Accession ID"
          value={ accession }
          options={ ACC }
          onChange={ (event) => setAccession(event.target.value) }
        />

        <AppCheckbox
          onChange={ (event) => setShowlegend(event.target.checked) }
          label="Show legend"
        />

        <div className="flex w-full">

          <AppButton
            className="primary-blue"
            type="Submit"
            onClick={ handleSubmit }
          >
          Save
          </AppButton>

          <AppButton
            className="primary-pink ml-3"
            type="Button"
            value="Reset"
            onClick={ handleReset }
          >
          Reset
          </AppButton>

        </div>

      </form>
    </AppDrawer>
  );
}