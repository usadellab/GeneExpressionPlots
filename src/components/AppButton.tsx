import React from 'react';

import AppRipple from './AppRipple';

const AppButton: React.FC<React.ButtonHTMLAttributes<{}>> = (props) => {
  return (
    <button
      {...props}
      className={`relative overflow-hidden cursor-pointer
                  flex items-center
                  rounded focus:outline-none
                  font-medium uppercase
                  ${props.className}`}
    >
      {props.children}

      {props.disabled || <AppRipple />}
    </button>
  );
};

export default AppButton;
