import {validateSample, processSampleList} from '../src/utils/fileHelper';
import fs from 'fs';
import path from 'path';

describe('fileParsing', function () {
  describe('#validateSample()', function() {
    let sample = {
      'name': 's1',
      'xTickValue': '1',
      'replicates': [{
        'separator': '',
        'accessionColumn': 1,
        'countColumn': 4,
        'header': true,
        'file': fs.readFileSync(path.resolve('src/test_data/test_input_expr_counts_table_head.tsv'), 'utf8')
      }
      ]
    };
    it('should be correct', function() {
      expect(validateSample(sample)).toBe(true);
    });
    it('should be sample Error', function() {
      delete sample.name;
      expect(() => validateSample(sample)).toThrowError(new Error('provided sample is missing properties!'));
    });

    it('should be replicate Error', function() {
      sample.name = 's1';
      delete sample.replicates[0].separator;
      expect(() => validateSample(sample)).toThrowError(new Error('provided replicates are missing properties!'));
    });

    it('should be missing replicates Error', function() {
      sample.replicates[0].separator = '';
      sample.replicates = [];
      expect(() => validateSample(sample)).toThrowError(new Error('provided sample has no replicates assigned!'));
    });
  });

  describe('#processSampleList()', function () {
    it('return correct object', async function () {
      let sample = {
        'name': 's1',
        'xTickValue': '1',
        'replicates': [{
          'separator': '',
          'accessionColumn': 1,
          'countColumn': 4,
          'header': true,
          'file': fs.readFileSync(path.resolve('./mocks/table_with_header.tsv'), 'utf8')
        },
        {
          'separator': '\t',
          'accessionColumn': 1,
          'countColumn': 4,
          'header': false,
          'file': fs.readFileSync(path.resolve('./mocks/table_no_header.tsv'), 'utf8')
        }
        ]
      };
      let sampleList = [sample,sample];

      let groupExp = {
        'myGroup': {
          'countUnit': 'tpm',
          'samples': [
            {
              'name': 's1',
              'xTickValue': '1',
              'replicates': [
                {
                  'PGSC0003DMT400039136': 1,
                  'PGSC0003DMT400039134': 22,
                  'PGSC0003DMT400039133': 0,
                  'PGSC0003DMT400058594': 301,
                  'PGSC0003DMT400058700': 19,
                  'PGSC0003DMT400058653': 813,
                  'PGSC0003DMT400058597': 66.9448,
                  'PGSC0003DMT400058598': 403.245,
                  'PGSC0003DMT400058600': 119.021
                },
                {
                  'PGSC0003DMT400039136': 1,
                  'PGSC0003DMT400039134': 22,
                  'PGSC0003DMT400039133': 0,
                  'PGSC0003DMT400058594': 301,
                  'PGSC0003DMT400058700': 19,
                  'PGSC0003DMT400058653': 813,
                  'PGSC0003DMT400058597': 66.9448,
                  'PGSC0003DMT400058598': 403.245,
                  'PGSC0003DMT400058600': 119.021
                }
              ]
            },
            {
              'name': 's1',
              'xTickValue': '1',
              'replicates': [
                {
                  'PGSC0003DMT400039136': 1,
                  'PGSC0003DMT400039134': 22,
                  'PGSC0003DMT400039133': 0,
                  'PGSC0003DMT400058594': 301,
                  'PGSC0003DMT400058700': 19,
                  'PGSC0003DMT400058653': 813,
                  'PGSC0003DMT400058597': 66.9448,
                  'PGSC0003DMT400058598': 403.245,
                  'PGSC0003DMT400058600': 119.021
                },
                {
                  'PGSC0003DMT400039136': 1,
                  'PGSC0003DMT400039134': 22,
                  'PGSC0003DMT400039133': 0,
                  'PGSC0003DMT400058594': 301,
                  'PGSC0003DMT400058700': 19,
                  'PGSC0003DMT400058653': 813,
                  'PGSC0003DMT400058597': 66.9448,
                  'PGSC0003DMT400058598': 403.245,
                  'PGSC0003DMT400058600': 119.021
                }
              ]
            }
          ]
        }
      };
      let groupPrv = await processSampleList('myGroup', 'tpm', sampleList);
      expect(groupPrv).toStrictEqual(groupExp);
    });
  });
});