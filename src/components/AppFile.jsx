import React from 'react';

import AppRipple from './AppRipple';


/**
 * @typedef  {Object} AppFileProps Properties object for the AppFile component.
 * @property {string} className css classes to apply in the root component
 *
 * @param {AppFileProps} props component properties
 */
export default function AppFile (props) {

  const { className, children, ...inputProps } = props;

  return (
    <label className={
      `relative overflow-hidden
       flex items-center cursor-pointer
       rounded focus:outline-none font-medium uppercase
       ${className}`
    }>
      <input className="hidden" type="file" { ...inputProps } />

      { children }

      <AppRipple />

    </label>
  );
}