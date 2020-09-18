import React, { useState } from 'react';


export default function AppText (props) {

  const { className, ...inputProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return (
    <label
      className={
        `relative group mb-10 border rounded bg-gray-100 hover:bg-white
         hover:border-gray-400 focus-within:border-blue-500 focus-within:border-2
       ${className}`
      }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <input
        className="py-3 px-4 w-full rounded bg-gray-100 text-gray-700 text-sm
                   focus:outline-none focus:bg-white group-hover:bg-white"
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
        type="text"
        { ...inputProps }
      />

      <p className={
        `absolute px-2 py-1 text-sm font-light
         ${ focus ? 'text-blue-500' : hover ? 'text-gray-600' : 'text-gray-500' }`
      } >
        { props.label }
      </p>

    </label>
  );
}