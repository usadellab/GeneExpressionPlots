/**
 * @typedef {import('./types').Group} Group
**/

/**
 *
 * @param {Group[]}       store   current store state
 * @param {Group|Group[]} payload group key in the data store
 */
function createGroup (store, payload) {

  return Array.isArray(payload)
    ? [ ...store, ...payload ]
    : [ ...store, payload ];

}

/**
 * Remove a key from the data store object.
 * @param {Group[]} store current store state
 * @param {string}    key   group key in the data store
 */
function removeGroup (store, key) {

  return store.filter((group, i) => i !== key);

}

// /**
//  * Update a key in the data store object.
//  * @param {Group[]} store current store state
//  * @param {string}  key   key to update in the store
//  * @param {Group[]} group group object value
//  */
// function updateGroup (store, key, newGroup) {

//   const group = store[key];
//   Object.assign(group,  newGroup);
//   return store;

// }
/**
 * Update a group in the data store object (either create new or add to existing group/sample)
 * @param {Group[]} store current store state
 * @param {object} replicateInput input for one replicate of the form
 * {
  "groupName": "string",
  "countUnit": "string",
  "sampleName": "string",
  "xTickValue": "number",
  "replicates": "[<replicate_obj>,<replicate_obj2>,...]"
}
 */
function updateGroup (store, replicateInput){
  let groupIndex = store.findIndex(group => group.name === replicateInput.groupName);

  if (groupIndex !== -1) {
    let sampleIndex = store[groupIndex].samples.findIndex(sample => sample.name === replicateInput.sampleName);
    if (sampleIndex !== -1) {
      store[groupIndex].samples[sampleIndex].replicates.push(...replicateInput.replicates);
    } else {
      let newSample = {
        name: replicateInput.sampleName,
        xTickValue: replicateInput.xTickValue,
        replicates: replicateInput.replicates
      };
      store[groupIndex].samples.push(newSample);
    }
  } else {
    let newGroup = {
      name: replicateInput.groupName,
      countUnit: replicateInput.countUnit,
      samples: [{
        name: replicateInput.sampleName,
        xTickValue: replicateInput.xTickValue,
        replicates: replicateInput.replicates
      }]
    };
    store.push(newGroup);
  }
  return [ ...store ];
}

/**
 * Perform operations on the data store.
 *
 * @typedef  {Object} StoreAction Dispatch object for the data store.
 * @property {string}        type    action type
 * @property {ActionPayload} payload action payload
 *
 * @typedef  {Object} ActionPayload Dispatch object payload
 * @property {string} key   group key in the store
 * @property {Group?} value corresponding group object
 *
 * @param {Group[]}     state  current store state
 * @param {StoreAction} action store dispatch object
 * @returns {Group[]} the new data store object
 */
export function dataStoreReducer (state, action) {

  const { type, payload } = action;

  switch (type) {

    case 'CREATE':
      return createGroup(state, payload.value);

    case 'UPDATE':
      return updateGroup(state, payload);

    case 'DELETE':
      return removeGroup(state, payload.key);

    default:
      throw new Error(`Unhandled data store action type: ${type}`);
  }

}