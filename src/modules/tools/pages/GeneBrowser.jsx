import React, { Component } from 'react';

import { autorun } from 'mobx';
import { dataTable, infoTable } from '@/store/data-store';
import { settings } from '@/store/settings';

import { escapeRegExp } from '@/utils/string';

import AppButton from '@/components/AppButton';
import AppIcon from '@/components/AppIcon';
import AppModal from '@/components/AppModal';
import AppNumber from '@/components/AppNumber';
import AppSelect from '@/components/AppSelect';
import AppText from '@/components/AppText';

import GeneDetails from '../components/GeneDetails';
import GeneCard from '@/components/cards/GeneCard';

export default class GeneBrowser extends Component {
  constructor() {
    super();
    this.state = {
      geneView: [],
      searchId: '',
      pageOffset: 1,
      pageMax: 1,
      countView: 20,
      //
      selectedGene: '',
      selectedGeneCounts: [],
    };
  }

  /* AUXILIARY */

  computeGeneView = () => {
    // Retrieve gene information matching the search parameters (empty search matches all)
    const regexp = new RegExp(escapeRegExp(this.state.searchId), 'i');
    const matchingResults = dataTable.rowNames.reduce((matches, accession) => {
      // Match text in the accessions ids
      const accessionMatch = accession.search(regexp) > -1;

      // Match text in the info fields
      const geneInfo = infoTable.getRowAsMap(accession) ?? new Map();
      const infoMatch = geneInfo
        ? Array.from(geneInfo.values()).some(
            (field) => field.search(regexp) > -1
          )
        : false;

      // Include in the results if any matches are found
      if (accessionMatch || infoMatch)
        matches.push({
          accession,
          geneInfo,
        });

      return matches;
    }, []);

    // Calculate the current page view
    const countView = parseInt(this.state.countView);
    const start = (this.state.pageOffset - 1) * countView;
    const end = this.state.pageOffset * countView;
    const geneView = matchingResults.slice(start, end);

    // Calculate the number of pages according to the current display options
    const pageMax =
      Math.ceil(matchingResults.length / this.state.countView) || 1;

    this.setState({ geneView, pageMax });
  };

  /* LYFECYCLE */

  componentDidMount() {
    this.disposeGeneViewListener = autorun(this.computeGeneView);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchId !== this.state.searchId ||
      prevState.pageOffset !== this.state.pageOffset ||
      prevState.countView !== this.state.countView
    ) {
      this.computeGeneView();
    }
  }

  componentWillUnmount() {
    this.disposeGeneViewListener();
  }

  /* EVENTS */

  /**
   * Update the _countDisplay_ state property.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  onDisplayCountSelect = (event) => {
    const countView = event.target.value;
    this.setState({ countView });
  };

  /**
   * Re-evaluate the captions result, including only accessions ids matching fully or
   * partially the current _searchId_ state property. This event also re-calculates the
   * _countOffset_ and _countView_ state properties.
   * @param {React.KeyboardEvent} event
   */
  onGeneSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      this.setState({ pageOffset: 1, searchId: event.target.value });
    }
  };

  /**
   * Update the _pageOffset_ state property.
   * @param {React.ChangeEvent<HTMLInputElement} event
   */
  onPageOffsetChange = (event) => {
    let pageOffset = event.target.value;

    if (pageOffset <= 0 || pageOffset > this.state.pageMax) {
      pageOffset = this.state.pageOffset;
    }

    this.setState({ pageOffset });
  };

  /* ACTIONS */

  /**
   * Toggle the gene details modal visibility.
   * @param {React.MouseEvent<HTMLDivElement>} event
   */
  selectGene = (selectedGene) => {
    let selectedGeneCounts;
    if (selectedGene) {
      const table = dataTable.getRowAsMap(selectedGene, true);
      selectedGeneCounts = [...table.entries()].map(
        ([[group, sample, replicate], count]) => ({
          group,
          sample,
          replicate,
          count,
        })
      );
    }
    this.setState({ selectedGene, selectedGeneCounts });
  };

  /* RENDER */

  render() {
    return (
      <div className="m-6">
        <div className="mt-4 flex flex-col lg:flex-row bg-white px-6 py-5">
          <AppText
            className="lg:w-3/4 w-full"
            id="gene-browser-search"
            label="Search accession"
            onKeyDown={this.onGeneSearchSubmit}
          />

          <div className="flex flex-col flex-grow sm:flex-row">
            <AppNumber
              className="w-full mt-4 sm:w-1/2 lg:ml-3 lg:mt-0"
              label={`Page ${this.state.pageOffset}/${this.state.pageMax}`}
              min={1}
              max={this.state.pageMax}
              required={true}
              value={this.state.pageOffset}
              onChange={this.onPageOffsetChange}
            />

            <AppSelect
              className="w-full mt-4 sm:ml-3 sm:w-1/2 lg:mt-0"
              id="gene-browser-search"
              label="Display count"
              value={this.state.countView}
              onChange={this.onDisplayCountSelect}
              options={[
                { value: 5 },
                { value: 10 },
                { value: 20 },
                { value: 50 },
                { value: 100 },
              ]}
            />
          </div>
        </div>

        <div className="bg-white mt-6">
          {this.state.geneView.map(({ accession, geneInfo }) => (
            <div
              className="group flex px-6 py-4 odd:bg-gray-100 hover:bg-yellow-100"
              key={accession}
              onDoubleClick={() => this.selectGene(accession)}
            >
              <GeneCard
                accession={accession}
                geneInfo={geneInfo}
                actions={[
                  <AppButton
                    key="gene-details"
                    onClick={() => this.selectGene(accession)}
                  >
                    <AppIcon
                      className="ml-4 w-6 h-6 text-gray-500 invisible group-hover:visible"
                      file="hero-icons"
                      id="eye"
                    />
                  </AppButton>,
                ]}
              />
            </div>
          ))}
        </div>

        {this.state.selectedGene && (
          <AppModal
            className="flex flex-col w-full h-full md:w-5/6 md:h-5/6 lg:w-3/4 2xl:w-1/2"
            title={this.state.selectedGene}
            showModal={this.state.selectedGene}
            hideModal={() => this.selectGene()}
          >
            <GeneDetails
              countUnit={settings.gxpSettings.unit}
              geneCounts={this.state.selectedGeneCounts}
            />
          </AppModal>
        )}
      </div>
    );
  }
}
