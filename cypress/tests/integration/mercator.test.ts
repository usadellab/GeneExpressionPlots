import { Dataframe } from '@/store/dataframe';
import { parseMercator } from '@/utils/parser';

const info_table = {
  header: ['pValue', 'pfamA'],
  rows: {
    'Gene-1': ['0.05', 'PF392847'],
    'Gene-2': ['0.02', 'PF392847'],
    'Gene-3': ['0.09', 'PF392847'],
    'Gene-4': ['0.09', 'PF392847'],
    'Gene-5': ['0.09', 'PF392847'],
    'Gene-6': ['0.09', 'PF392847'],
  },
};

const mercator_table =
  "BINCODE\tNAME\tIDENTIFIER\tDESCRIPTION\tTYPE\n'1'\t'Photosynthesis'\t''\t''\t\n'1.1'\t'Photosynthesis.photophosphorylation'\t''\t''\t\n'1.1.1'\t'Photosynthesis.photophosphorylation.photosystem II'\t''\t''\t\n'1.1.1.1'\t'Photosynthesis.photophosphorylation.photosystem II.LHC-II complex'\t''\t''\t\n'1.1.1.1.1'\t'Photosynthesis.photophosphorylation.photosystem II.LHC-II complex.component LHCb1/2/3'\t'gene-1'\t'component LHCb1/2/3 of LHC-II complex'\tT\n'1.1.1.1.1'\t'Photosynthesis.photophosphorylation.photosystem II.LHC-II complex.component LHCb1/2/3'\t'gene-2'\t'component LHCb1/2/3 of LHC-II complex'\tT\n'1.1.1.1.2'\t'Photosynthesis.photophosphorylation.photosystem II.LHC-II complex.component LHCb4'\t'gene-3'\t'component LHCb4 of LHC-II complex'\tT\n'1.1.1.1.2'\t'Photosynthesis.photophosphorylation.photosystem II.LHC-II complex.component LHCb4'\t'gene-4'\t'component LHCb4 of LHC-II complex'\tT\n'1.1.1.1.3'\t'Photosynthesis.photophosphorylation.photosystem II.LHC-II complex.component LHCb5'\t'gene-5'\t'component LHCb5 of LHC-II complex'\tT\n'1.1.1.2'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex'\t''\t''\t\n'1.1.1.2.1'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex'\t''\t''\t\n'1.1.1.2.1.1'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.component D1/PsbA'\t''\t''\t\n'1.1.1.2.1.2'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.component D2/PsbD'\t''\t''\t\n'1.1.1.2.1.3'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.component CP47/PsbB'\t''\t''\t\n'1.1.1.2.1.4'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.component CP43/PsbC'\t''\t''\t\n'1.1.1.2.1.5'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.cytochrome b559 heterodimer'\t''\t''\t\n'1.1.1.2.1.5.1'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.cytochrome b559 heterodimer.component alpha/PsbE'\t''\t''\t\n'1.1.1.2.1.5.2'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.cytochrome b559 heterodimer.component beta/PsbF'\t''\t''\t\n'1.1.1.2.1.6'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.reaction center complex.component PsbI'\t'gene-6'\t'component PsbI of PS-II reaction center complex'\tT\n'1.1.1.2.2'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.oxygen-evolving center (OEC) extrinsic proteins'\t''\t''\t\n'1.1.1.2.2.1'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.oxygen-evolving center (OEC) extrinsic proteins.component OEC33/PsbO'\t'gene-1'\t'component PsbO/OEC33 of PS-II oxygen-evolving center'\tT\n'1.1.1.2.2.1'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.oxygen-evolving center (OEC) extrinsic proteins.component OEC33/PsbO'\t'gene-2'\t'component PsbO/OEC33 of PS-II oxygen-evolving center'\tT\n'1.1.1.2.2.2'\t'Photosynthesis.photophosphorylation.photosystem II.PS-II complex.oxygen-evolving center (OEC) extrinsic proteins.Viridiplantae-specific components'\t''\t''\t\n";

const df = new Dataframe();
df.loadFromObject(info_table);

describe('parse Mercator table', function () {
  it('correctly parse a Mercator output', async () => {
    const table = parseMercator(mercator_table);

    expect(table).to.deep.eq({
      header: ['BINCODE'],
      rows: {
        'gene-1': ['1.1.1.1.1', '1.1.1.2.2.1'],
        'gene-2': ['1.1.1.1.1', '1.1.1.2.2.1'],
        'gene-3': ['1.1.1.1.2'],
        'gene-4': ['1.1.1.1.2'],
        'gene-5': ['1.1.1.1.3'],
        'gene-6': ['1.1.1.2.1.6'],
      },
    });
  });

  // it('add to existing table', () => {

  // });

  // it('add to non-existing table', () => {

  // });
});
