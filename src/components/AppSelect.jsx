import React, { useState } from 'react';

/**
 * @typedef  {Object}   AppSelectProps
 * @property {string}   className css classes to apply in root
 * @property {string[]} options   select options
 *
 * @param {AppSelectProps} props component properties
 */
export default function AppSelect (props) {

  const { className, options, ...selectProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return (
    <div
      className={ `group ${className}` }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <select
        className="py-3 px-4 w-full
                   rounded border-2 border-transparent
                   hover:border-blue-400 focus:border-blue-600
                   shadow-xs bg-gray-100 text-gray-800 text-sm
                   focus:outline-none focus:bg-white group-hover:bg-white"
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
        { ...selectProps }
      >
        {
          options?.map((opt,index) =>
            <option
              key={ `${opt.value}-${index}`}
              value={ opt.value }
            >
              { opt.label }
            </option>
          )
        }
      </select>

      <label
        htmlFor={ props.label }
        className={
          `px-1 py-1 text-sm
           ${ focus ? 'text-blue-500' : hover ? 'text-gray-800' : 'text-gray-600' }`
        }
      >
        { props.label }
      </label>


    </div>
  );
}