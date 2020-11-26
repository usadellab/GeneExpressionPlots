import React, { useState } from 'react';

export default function AppSelect (props) {

  const { className, options, ...selectProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return (
    <div
      className={ className }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <select
        { ...selectProps }
        id={ props.label || props.id }
        className="py-3 px-4 w-full
                   rounded border-2 border-gray-300
                   hover:border-blue-500 focus:border-blue-600
                   shadow-xs bg-white text-gray-800 text-sm
                   focus:outline-none"
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
      >
        {
          options?.map((opt) =>
            <option
              key={ opt.value }
              value={ opt.value }
              disabled={ opt.disabled }
            >
              { opt.label ?? opt.value }
            </option>
          )
        }
      </select>

      <label
        htmlFor={ props.label || props.id }
        className={
          `px-1 py-1 text-sm
           ${ focus ? 'text-blue-600' : hover ? 'text-gray-800' : 'text-gray-600' }`
        }
      >
        { props.label }
      </label>


    </div>
  );
}