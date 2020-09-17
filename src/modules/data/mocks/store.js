import '../typedefs';

/**
 * MOCK DATA
 */

/**
 * @type {Replicate}
 */
const replicates = [
  {
    PGSC0003DMT400039136: 1,
    PGSC0003DMT400039134: 22,
    PGSC0003DMT400039133: 0
  },
  {
    PGSC0003DMT400039136: 2,
    PGSC0003DMT400039134: 24,
    PGSC0003DMT400039133: 0
  },
];

/**
 * @type {Sample[]}
 */
const samples = [

  {
    name: 'DAS-1',
    number: 1,
  }

];

/**
 * @type {SampleGroups}
 */
const groups = {
  'HSA-Apical': {
    describe: 'Heat-Shock Arabidopsis on the apical tissue on the apical tissu on the apical tissu on the apical tissu on the apical tissu on the apical tissu on the apical tissu on the apical tissu on the apical tissueeeeeeee on the apical tissu on the apical tissuee.',
    countUnit: 'tpm',
    samples,
    replicates,
  },
  'HSA-Meristem': {
    describe: 'Heat-Shock Arabidopsis on the meristem tissue.',
    countUnit: 'tpm',
    samples,
    replicates,
  }
};

/**
 * @type {DataStore}
 */
export const mockStore = {
  selectedGroup: '',
  groups,
};
