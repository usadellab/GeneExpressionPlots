/**
 * @typedef  {Object<string,Group>} DataStore Store object for the data module.
**/

/**
 * @typedef  {Object} StoreAction Dispatch object for the data store.
 * @property {string}        type    action type
 * @property {ActionPayload} payload action payload
**/

/**
 * @typedef  {Object} ActionPayload Dispatch object payload
 * @property {string} key   group key in the store
 * @property {Group?} value corresponding group object
**/
