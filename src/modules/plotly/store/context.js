import React, { createContext, useContext, useReducer } from 'react';

import { plotStoreReducer } from './reducer';

/**
 * @typedef {import('./types').Group} Group
**/

/** @type {React.Context<Group[]>} */
const PlotStateContext = createContext();

/** @type {React.Context<React.Dispatch<StoreAction>} */
const PlotDispatchContext = createContext();

/**
 * Create a Context.Provider to subscribe in children components.
 * @param {Object<string,JSX.Element[]>} DOM a DOM-like object with children elements
 */
export function PlotStoreProvider({ children }) {

  const [ state, dispatch ] = useReducer(plotStoreReducer, [ ]);

  return (
    <PlotStateContext.Provider value={ state }>
      <PlotDispatchContext.Provider value={ dispatch }>
        { children }
      </PlotDispatchContext.Provider>
    </PlotStateContext.Provider>
  );
}

/**
 * Subscriber hook to retrieve and mutate data state.
 */
export function usePlotStore() {

  const state    = useContext(PlotStateContext);
  const dispatch = useContext(PlotDispatchContext);

  if (!state || !dispatch)
    throw new Error('usePlotStore must be used within a PlotProvider');

  return {
    state,
    dispatch
  };
}
