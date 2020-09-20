function createGroup (store, key) {

  store.push(key);
  return store;

}

/**
 * Remove a key from the data store object.
 * @param {DataStore} store current store state
 * @param {string}    key   group key in the data store
 */
function removeGroup (store, key) {

  return store.filter((group, i) => i !== key);

}

/**
 * Update a key in the data store object.
 * @param {DataStore} store current store state
 * @param {string}    key   key to update in the store
 * @param {Group}     group group object value
 */
function updateGroup (store, key, newGroup) {

  const group = store[key];
  Object.assign(group,  newGroup);
  return store;

}

/**
 * Perform operations on the data store.
 * @param {DataStore}   state  current store state
 * @param {StoreAction} action store dispatch object
 * @returns {DataStore} the new data store object
 */
export function dataStoreReducer (state, action) {

  const { type, payload } = action;

  switch (type) {

    case 'CREATE':
      return createGroup(state, payload.value);

    case 'UPDATE':
      return updateGroup(state, payload.key, payload.value);

    case 'DELETE':
      return removeGroup(state, payload.key);

    default:
      throw new Error(`Unhandled data store action type: ${type}`);
  }

}