/**
 * Remove a key from the data store object.
 * @param {DataStore} store current store state
 * @param {string}    key   group key in the data store
 */
function removeGroup (store, key) {

  const { [key]: _, ...rest } = store;

  console.log(key);
  console.log(rest);

  return Object.assign({}, rest);

}

/**
 * Update a key in the data store object.
 * @param {DataStore} store current store state
 * @param {string}    key   key to update in the store
 * @param {Group}     group group object value
 */
function updateGroup (store, key, group) {

  return Object.assign({}, store, { [key]: group });

}

/**
 * Perform CRUD operations on the data store.
 * @param {DataStore}   state  current store state
 * @param {StoreAction} action store dispatch object
 * @returns {DataStore} the new data store object
 */
export function dataStoreReducer (state, action) {

  const { type, payload } = action;

  switch (type) {

    case 'UPDATE':
      return updateGroup(state, payload.key, payload.value);

    case 'DELETE':
      return removeGroup(state, payload.key);

    default:
      throw new Error(`Unhandled data store action type: ${type}`);
  }

}