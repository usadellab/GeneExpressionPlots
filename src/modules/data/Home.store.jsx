import React, { createContext, useContext, useReducer } from 'react';

import './typedefs';


const DataStateContext = createContext();
const DataDispatchContext = createContext();

/**
 * Reducer function to update data state.
 * @param   {DataStore}   state  reactive object holding the state
 * @param   {StoreAction} action action and payload dispatch
 * @returns {DataStore}   the data store object
 */
function dataReducer(state, action) {

  const { type, payload } = action;

  switch (type) {
    case 'UPDATE':
      return Object.assign({}, state, payload);

    case 'DELETE':
      return state;

    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}

/**
 * Create a Context.Provider to subscribe in children components.
 * @param {Object<string,JSX.Element[]>} DOM a DOM-like object with children elements
 */
export function DataStoreProvider({ children }) {

  const [state, dispatch] = useReducer(dataReducer, {});

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
 * @return {[DataStore,React.Dispatch<StoreAction>]}
 */
export function useDataStore() {

  const state = useContext(DataStateContext);
  const setState = useContext(DataDispatchContext);

  if (!state || !setState)
    throw new Error('useDataState must be used within a DataProvider');

  return [state, setState];
}
