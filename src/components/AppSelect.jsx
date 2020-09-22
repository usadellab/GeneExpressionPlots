import React, { useState } from 'react';

export default function AppSelect (props) {

  const { className, options, ...selectProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return (
    <label
      className={
        `relative group mb-10
         rounded border-2 border-white hover:border-gray-400 focus-within:border-blue-500
         bg-gray-100 hover:bg-white
       ${className}`
      }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <select
        className="py-3 px-4 w-full
                   shadow-inner focus:shadow-none rounded focus:outline-none
                   bg-gray-100 focus:bg-white
                   text-sm text-gray-700"
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
        { ...selectProps }
      >
        {
          options.map(opt =>
            <option
              key={ opt }
              value={ opt }
            >
              { opt }
            </option>
          )
        }
      </select>

      <p
        className={
          `absolute px-2 py-1 text-sm font-light
           ${ focus ? 'text-blue-500' : hover ? 'text-gray-600' : 'text-gray-500' }`
        }
      >
        { props.label }
      </p>

    </label>
  );
}