import { zTransformMatrix } from '@/utils/store';
import { transpose } from 'd3';
import { PCA } from 'ml-pca';

// Solyc expression count data
import dataImport from '../../fixtures/Sup_table_1_transcriptome_Reimer_et_al_no_module_color.json';

const data = dataImport as number[][];
const zTransformedData = zTransformMatrix(data);

describe('z-transformation', function () {
  it('test correct z-transformation of data', () => {
    // Solyc z-transformed expression counts via R
    cy.fixture(
      'Sup_table_1_transcriptome_Reimer_et_al_no_module_color_z_transformed.json'
    ).then((zData: number[][]) => {
      // check for differences
      const checks = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          const check = Math.abs(zTransformedData[i][j] - zData[i][j]) <= 1e-10;
          checks.push(check);
        }
      }
      expect(checks.every((x) => x)).to.be.true;
    });
  });
});

describe.only('pca', function () {
  const zData = transpose<number>(zTransformedData);
  // compute pca as done in the application
  const pca = new PCA(zData);

  it('correct proportion of explained variance', () => {
    // load pca fraction of variance explained values calculated from R
    cy.fixture(
      'Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA_frac_var_per_PC.json'
    ).then((data: number[]) => {
      // get explained variance
      const varExpl = pca.getExplainedVariance();
      // check for differences
      const checks = [];
      for (let i = 0; i < data.length; i++) {
        const check = Math.abs(data[i] - varExpl[i]) <= 1e-5;
        checks.push(check);
      }
      expect(checks.every((x) => x)).to.be.true;
    });
  });

  it('correct projection matrix', () => {
    // load projection matrix from R
    cy.fixture(
      'Sup_table_1_transcriptome_Reimer_et_al_Solyc_CPM_PCA_mtrx'
    ).then((data: number[][]) => {
      // project data as done in the application
      const projectedData = pca.predict(zData);
      // check for differences
      const checks = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          const check =
            Math.abs(data[i][j]) - Math.abs(projectedData.getRow(i)[j]) <= 1e-5;
          checks.push(check);
        }
      }
      expect(checks.every((x) => x)).to.be.true;
    });
  });
});
