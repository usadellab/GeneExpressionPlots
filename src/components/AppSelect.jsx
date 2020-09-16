import React from 'react';

import '../css/app-select-input.css';


export default function AppSelect (props) {

  const { className, options, ...selectProps } = props;

  return (
    <label className={ className } >

      <div className="select-container" >

        <select { ...selectProps } >
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
      </div>

      <p> { props.label } </p>

    </label>
  );
}