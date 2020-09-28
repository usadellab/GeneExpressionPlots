import React from 'react';

import AppRipple from './AppRipple';

export default function AppButton (props) {

  const { className, ...buttonProps } = props;

  return (
    <button
      className={
        `relative overflow-hidden
         flex items-center cursor-pointer
         rounded focus:outline-none
         font-medium uppercase
         ${className}`
      }
      { ...buttonProps }
    >

      { props.children }

      <AppRipple />

    </button>
  );
}