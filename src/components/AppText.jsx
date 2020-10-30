import React, { useState } from 'react';


export default function AppText (props) {

  const { className, ...inputProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return (
    <div
      className={ `group ${className}` }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <input
        id={ props.label }
        className="py-3 px-4 w-full
                   rounded border-2 border-transparent
                   hover:border-blue-400 focus:border-blue-600
                   shadow-xs bg-gray-100 text-gray-800 text-sm
                   focus:outline-none focus:bg-white group-hover:bg-white"
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
        type="text"
        { ...inputProps }
      />

      {
        props.label &&
        <label
          htmlFor={ props.label }
          className={
            `px-1 py-1 text-sm
           ${ focus ? 'text-blue-500' : hover ? 'text-gray-800' : 'text-gray-600' }`
          }
        >
          { props.label }
        </label>
      }

    </div>
  );
}
