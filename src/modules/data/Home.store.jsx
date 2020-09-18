import React, { createContext, useContext, useReducer } from 'react';

import { dataStoreReducer } from './reducers/store-reducer';

import './typedefs';


const DataStateContext = createContext();
const DataDispatchContext = createContext();

/**
 * Create a Context.Provider to subscribe in children components.
 * @param {Object<string,JSX.Element[]>} DOM a DOM-like object with children elements
 */
export function DataStoreProvider({ children }) {

  const [state, dispatch] = useReducer(dataStoreReducer, []);

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
