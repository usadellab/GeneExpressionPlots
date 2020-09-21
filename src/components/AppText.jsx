import React, { useState } from 'react';


export default function AppText (props) {

  const { className, ...inputProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return (
    <label
      className={
        `relative group ${props.label ? 'mb-10' : ''}
         rounded border-2 border-transparent hover:border-blue-400 focus-within:border-blue-600
         bg-gray-100 hover:bg-white
         ${className}`
      }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <input
        className="py-3 px-4 w-full
                   shadow-xs rounded bg-gray-100 text-gray-800 text-sm
                   focus:outline-none focus:bg-white group-hover:bg-white"
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
        type="text"
        { ...inputProps }
      />

      {
        props.label && <p className={
          `absolute px-2 py-1 text-sm
          ${ focus ? 'text-blue-600' : hover ? 'text-gray-800' : 'text-gray-700' }`
        } >
          { props.label }
        </p>
      }
    </label>
  );
}