import React, { createContext, useContext, useReducer } from 'react';

const DataStateContext = createContext();
const DataDispatchContext = createContext();

/**
 * Reducer function to update data state.
 * @param {object} state reactive object holding the state
 * @param {object} action action object with type and payload properties
 */
function dataReducer(state, action) {

  const { type, payload } = action;

  switch (type) {
    case 'ADD_GROUP':
      return Object.assign({}, state, payload);

    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
}

/**
 * Create a Context.Provider to subscribe in children components.
 * @param {object} DOM a DOM-like object with children elements
 */
export function DataStoreProvider({ children }) {

  const [state, dispatch] = useReducer(dataReducer, {});

  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
}

/**
 * Subscriber hook to retrieve and mutate data state.
 */
export function useDataStore() {

  const state = useContext(DataStateContext);
  const setState = useContext(DataDispatchContext);

  if (!state || !setState)
    throw new Error('useDataState must be used within a DataProvider');

  return [state, setState];
}
