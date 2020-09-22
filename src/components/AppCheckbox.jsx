import React from 'react';


export default function AppText (props) {

  const { className, label, ...inputProps } = props;

  return (
    <label
      className={
        `relative flex items-center group ${props.label ? 'mb-10' : ''}
         hover:bg-white
         ${className}`
      }
    >

      <input
        className="ml-2 py-3 px-4"
        type="checkbox"
        { ...inputProps }
      />

      <span className="ml-2 select-none text-gray-800">{ label }</span>

    </label>
  );
}
