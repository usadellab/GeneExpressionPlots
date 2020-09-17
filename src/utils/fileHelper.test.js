import assert from 'assert';
import {validateSample, processSampleList} from './fileHelper';
import fs from 'fs';

describe('fileParsing', function () {
  describe('#validateSample()', function() {
    let sample = {
      "name": " s1",
      "xTickValue": " 1",
      "replicates": [{
        "separator": "",
        "accessionColumn": 1,
        "countColumn": 4,
        "header": true,
        "file": fs.readFileSync("/home/cons/GeneExpressionPlots_/test_input_expr_counts_table_head.tsv", 'utf8')

      }
      ]
    };
    it('should be correct', function() {
      assert.strictEqual(validateSample(sample),true);
    });
    it('should be sample Error', function() {
      delete sample.name;
      assert.throws(()=> {validateSample(sample);},Error,"provided sample is missing properties!");
    });

    it('should be replicate Error', function() {
      sample.name = "s1";
      delete sample.replicates[0].separator;
      assert.throws(()=> {validateSample(sample);},Error,"provided replicates are missing properties!");
    });

    it('should be missing replicates Error', function() {
      sample.replicates[0].separator = "";
      sample.replicates = [];
      assert.throws(()=> {validateSample(sample);},Error,"provided sample has no replicates assigned!");
    });
  });

  describe('#processSampleList()', function () {
    it('return correct object', async function () {
      let sample = {
        "name": " s1",
        "xTickValue": "1",
        "replicates": [{
          "separator": "",
          "accessionColumn": 1,
          "countColumn": 4,
          "header": true,
          "file": fs.readFileSync("/home/cons/GeneExpressionPlots_/test_input_expr_counts_table_head.tsv", 'utf8')
        },
        {
          "separator": "",
          "accessionColumn": 1,
          "countColumn": 4,
          "header": true,
          "file": fs.readFileSync("/home/cons/GeneExpressionPlots_/test_input_expr_counts_table_head.tsv", 'utf8')
        }
        ]
      };
      let sampleList = [sample,sample];

      let groupExp = {
        "myGroup": {
          "countUnit": "tpm",
          "samples": [
            {
              "name": " s1",
              "xTickValue": "1",
              "replicates": [
                {
                  "PGSC0003DMT400039136": "1",
                  "PGSC0003DMT400039134": "22",
                  "PGSC0003DMT400039133": "0",
                  "PGSC0003DMT400058594": "301",
                  "PGSC0003DMT400058700": "19",
                  "PGSC0003DMT400058653": "813",
                  "PGSC0003DMT400058597": "66.9448",
                  "PGSC0003DMT400058598": "403.245",
                  "PGSC0003DMT400058600": "119.021"
                },
                {
                  "PGSC0003DMT400039136": "1",
                  "PGSC0003DMT400039134": "22",
                  "PGSC0003DMT400039133": "0",
                  "PGSC0003DMT400058594": "301",
                  "PGSC0003DMT400058700": "19",
                  "PGSC0003DMT400058653": "813",
                  "PGSC0003DMT400058597": "66.9448",
                  "PGSC0003DMT400058598": "403.245",
                  "PGSC0003DMT400058600": "119.021"
                }
              ]
            },
            {
              "name": " s1",
              "xTickValue": "1",
              "replicates": [
                {
                  "PGSC0003DMT400039136": "1",
                  "PGSC0003DMT400039134": "22",
                  "PGSC0003DMT400039133": "0",
                  "PGSC0003DMT400058594": "301",
                  "PGSC0003DMT400058700": "19",
                  "PGSC0003DMT400058653": "813",
                  "PGSC0003DMT400058597": "66.9448",
                  "PGSC0003DMT400058598": "403.245",
                  "PGSC0003DMT400058600": "119.021"
                },
                {
                  "PGSC0003DMT400039136": "1",
                  "PGSC0003DMT400039134": "22",
                  "PGSC0003DMT400039133": "0",
                  "PGSC0003DMT400058594": "301",
                  "PGSC0003DMT400058700": "19",
                  "PGSC0003DMT400058653": "813",
                  "PGSC0003DMT400058597": "66.9448",
                  "PGSC0003DMT400058598": "403.245",
                  "PGSC0003DMT400058600": "119.021"
                }
              ]
            }
          ]
        }
      };
      let groupPrv = await processSampleList("myGroup", "tpm", sampleList);
      assert.deepStrictEqual(groupPrv, groupExp);
    });
  });
});