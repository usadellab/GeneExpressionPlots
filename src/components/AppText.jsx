import React, { useState } from 'react';

import '../css/app-text-input.css';


export default function AppText (props) {

  const { className, ...inputProps } = props;

  return (
    <label className={ className }>
      <div className="input-container">
        <input
          type="text"
          { ...inputProps }
        />
      </div>
      <p>
        { props.label }
      </p>
    </label>
  );
}