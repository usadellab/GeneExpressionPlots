import React, { useState } from 'react';


export default function AppTextArea (props) {

  const { className, ...textAreaProps } = props;

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  // const [ rows, setRows ] = useState(parseInt(textAreaProps.rows) || 3);

  // const minRows = textAreaProps.rows - 1;
  // const maxRows = parseInt(textAreaProps.rows) + 3;

  /**
   * Dynamically resize the area and update the value.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} event textarea change event
   */
  // const handleTextChange = (event) => {

  //   // Retrieve number of rows and reset to minRows
  //   const currRows = event.target.rows;
  //   event.target.rows = minRows;

  //   // Compute the new number of needed rows
  //   const newRows = ~~( event.target.scrollHeight / (1.5 * 16) );

  //   // Reset row count to its previous value if there is no change
  //   if (newRows === currRows) {
  //     event.target.rows = newRows;
  //   }

  //   // Set to maxRows if overflow, and keep the scroll-focus
  //   if (newRows >= maxRows) {
  //     event.target.rows = maxRows;
  //     event.target.scrollTop = event.target.scrollHeight;
  //   }

  //   // Set state variables
  //   setRows(newRows < maxRows ? newRows : maxRows);
  //   // TODO: Change text state
  // };

  return (
    <label
      className={
        `relative group mb-10
         rounded border-2 border-transparent hover:border-gray-400 focus-within:border-blue-500
         bg-gray-100 hover:bg-white
       ${className}`
      }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
    >

      <textarea
        className="py-3 px-4 w-full
                   shadow-inner focus:shadow-none rounded bg-gray-100 text-gray-700 text-sm
                   focus:outline-none focus:bg-white group-hover:bg-white"
        { ...textAreaProps }
        onFocus={ () => setFocus(true) }
        onBlur={ () => setFocus(false) }
        // rows={ rows }
      />

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