import React from 'react';

import AppRipple from './AppRipple';

export default function AppButton (props) {

  const { className, ...buttonProps } = props;

  return (
    <button
      className={
        `relative overflow-hidden cursor-pointer
         flex items-center
         rounded focus:outline-none
         font-medium uppercase
         ${className}`
      }
      { ...buttonProps }
    >

      { props.children }

      {
        props.disabled ||
        <AppRipple />
      }

    </button>
  );
}