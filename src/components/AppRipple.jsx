import React, { useState, useLayoutEffect } from 'react';
//
import '../css/app-ripple.css';


/**
 * Clear the ripple from the DOM after the animation is complete.
 * @param {number} rippleCount active ripples in the DOM
 * @param {number} duration ripple duration
 * @param {function} cleanUpFunction callback that removes all ripples
 */
const useDebouncedRippleCleanUp = (
  rippleCount, duration, cleanUpFunction
) => useLayoutEffect(() => {

  let bounce = null;

  if (rippleCount > 0) {

    clearTimeout(bounce);

    bounce = setTimeout(() => {

      cleanUpFunction();
      clearTimeout(bounce);

    }, duration * 4);
  }

  return () => clearTimeout(bounce);

}, [ rippleCount, duration, cleanUpFunction ]);


export default function Ripple ({ duration = 100, color = '#e2e8f0' }) {

  const [ rippleArray, setRippleArray ] = useState([]);

  useDebouncedRippleCleanUp(rippleArray.length, duration, () => setRippleArray([]));

  /**
   * Add a ripple object to the array
   * @param {MouseEvent} event mouse-down event
   */
  const addRipple = event => {

    // Get the ripple container dimensions
    const rippleContainer = event.currentTarget.getBoundingClientRect();

    const size = rippleContainer.width > rippleContainer.height
      ? rippleContainer.width
      : rippleContainer.height;

    // Create the ripple at the mouse-event origin coordinates
    const x = event.pageX - rippleContainer.x - size / 2 - window.scrollX;
    const y = event.pageY - rippleContainer.y - size / 2 - window.scrollY;

    const newRipple = { x, y, size };

    // Add the ripple object to the state
    setRippleArray([...rippleArray, newRipple]);
  };

  return (
    <div
      duration={duration}
      color={color}
      onMouseDown={addRipple}
      className="absolute inset-0"
    >
      {
        rippleArray.map((ripple, index) =>
          <span
            className='absolute opacity-75 rounded-full ripple-anim'
            key={'span' + index}
            style={{
              top: ripple.y,
              left: ripple.x,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: color
            }}
          />
        )
      }
    </div>
  );
}
