/**
 * @typedef  {import('../store').Group} Group
**/

/**
 * @typedef  {Object} DataViewProps Properties object for the DataView component.
 * @property {string} className css classes to apply in the root element
**/

/**
 * @typedef  {Object} GroupViewProps Properties object for the GroupVIew component.
 * @property {string} className css classes to apply in the root element
 * @property {Group}  group     new or existing group object
**/

/**
 * @typedef  {Object} GroupItemProps Properties object for the GroupItem component.
 * @property {number} groupIndex
 * @property {Group}  group
**/

/**
 * @typedef  {Object} GroupItemStatProps Properties object for the GroupStat component
 * @property {string} label stat item label
 * @property {string} value stat item value
**/

/**
 * @typedef  {Object} RouteParams Properties found in react-router-dom useParams()
 * @property {number} groupIndex  index of a group in the store
 * @property {number} sampleIndex index of a sample within the group
**/