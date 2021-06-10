import React from 'react';

export default function AppText(props) {
  const { className, label, ...inputProps } = props;

  return (
    <div className={`relative ${className}`}>
      <input id={props.label} type="checkbox" {...inputProps} />

      <label className="ml-2" htmlFor={props.label}>
        {label}
      </label>
    </div>
  );
}
