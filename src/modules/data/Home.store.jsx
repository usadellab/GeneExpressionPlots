import React, { createContext, useContext, useReducer } from 'react';

import { dataStoreReducer } from './reducers/store-reducer';


/* TYPES */

export class Group {
  name = '';
  describe = '';
  countUnit = '';
  samples = [];
}


/* CONTEXT */

/** @type {React.Context<Group[]>} */
const DataStateContext = createContext();

/** @type {React.Context<React.Dispatch<StoreAction>} */
const DataDispatchContext = createContext();

/**
 * Create a Context.Provider to subscribe in children components.
 * @param {Object<string,JSX.Element[]>} DOM a DOM-like object with children elements
 */
export function DataStoreProvider({ children }) {

  const [ state, dispatch ] = useReducer(dataStoreReducer, []);

  return (
    <DataStateContext.Provider value={ state }>
      <DataDispatchContext.Provider value={ dispatch }>
        { children }
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

/**
 * Subscriber hook to retrieve and mutate data state.
 */
export function useDataStore() {

  const state    = useContext(DataStateContext);
  const dispatch = useContext(DataDispatchContext);

  if (!state || !dispatch)
    throw new Error('useDataStore must be used within a DataProvider');

  return {
    state,
    dispatch
  };
}
