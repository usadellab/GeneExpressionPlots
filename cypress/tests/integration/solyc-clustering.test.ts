import { computeGeneXDistance } from '@/utils/plots/heatmap';
import { zTransformMatrix } from '@/utils/store';
import { transpose } from 'd3';

// Solyc expression count data
import dataImport from '../../fixtures/Sup_table_1_transcriptome_Reimer_et_al_no_module_color.json';
// Solyc correlation data calculated with R
import distanceImport from '../../fixtures/Sup_table_1_transcriptome_Reimer_et_al_Solyc_z_transf_correlation.json';

const data = dataImport as number[][];
const zTransformedData = zTransformMatrix(data);
const distance = distanceImport as number[][];

describe('Solyc correlation and hierarchical clustering', function () {
  it('test correct correlation matrix calculation', () => {
    // compute correlation Matrix
    const distanceMatrix = computeGeneXDistance(
      transpose(zTransformedData),
      'correlation'
    );
    // check for differences
    const checks = [];
    for (let i = 0; i < distance.length; i++) {
      for (let j = 0; j < distance[i].length; j++) {
        const check = Math.abs(distance[i][j] - distanceMatrix[i][j]) <= 1e-10;
        checks.push(check);
      }
    }
    expect(checks.every((x) => x)).to.be.true;
  });
});
