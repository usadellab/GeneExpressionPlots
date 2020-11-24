import React, { Component } from 'react';
import { autorun } from 'mobx';
import { store } from '@/store';
import AppText from '@/components/AppText';
import AppSelect from '@/components/AppSelect';

export default class GeneBrowser extends Component {
  constructor () {
    super();
    this.state = {
      geneView: [],
      searchId: '',
      countOffset: 0,
      countView: 20,
    };
  }

  /* AUXILIARY */

  computeGeneView = () => {

    let geneView = [];
    let countOffset = this.state.countOffset;

    for (const accessionId of store.accessionIds) {

      if (this.state.searchId && !accessionId.includes(this.state.searchId))
        continue;

      geneView.push({
        accessionId,
        description: store.captions[accessionId]
      });

      countOffset++;
      if (countOffset > this.state.countView)
        break;
    }

    this.setState({ geneView });
  }

  /* LYFECYCLE */

  componentDidMount () {
    autorun( this.computeGeneView );
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      prevState.countView !== this.state.countView
      || prevState.searchId !== this.state.searchId
    ) {
      this.computeGeneView();
    }
  }

  /* EVENTS */

  /**
   * Update the _countDisplay_ state property.
   * @param {React.ChangeEvent<HTMLSelectElement>} event
   */
  onDisplayCountSelect = (event) => {
    const countView = event.target.value;
    this.setState({ countView });
  }

  /**
   * Re-evaluate the captions result, including only accessions ids matching fully or
   * partially the current _searchId_ state property. This event also re-calculates the
   * _countOffset_ and _countView_ state properties.
   * @param {React.KeyboardEvent} event
   */
  onGeneSearchSubmit = (event) => {
    if (event.key === 'Enter')
      this.setState({ searchId: event.target.value});
  }

  /* RENDER */

  render() {
    return (
      <div className="m-2">
        <div className="mt-4 flex">

          <AppText
            className="w-3/4"
            id="gene-browser-search"
            label="Search accession"
            onKeyDown={ this.onGeneSearchSubmit }
          />

          <AppSelect
            id="gene-browser-search"
            className="ml-3 w-1/4"
            label="Display count"
            value={ this.state.countView }
            onChange={ this.onDisplayCountSelect }
            options={[
              { value: 5 },
              { value: 10 },
              { value: 20 },
              { value: 50 },
              { value: 100 },
            ]}
          />

        </div>

        <div className="bg-white mt-6 p-6">
          {
            // store.accessionIds
            //   .filter(accessionId => this.state.searchId ? accessionId.includes(this.state.searchId) : true)
            //   .slice(this.state.countOffset, this.state.countView)
            this.state.geneView.map(({ accessionId, description }) => (

              <div
                className="py-3"
                key={ accessionId }
              >
                <div className="font-bold">{ accessionId }</div>
                <div className="mx-6">{ description }</div>
              </div>

            ))
          }
        </div>
      </div>
    );
  }
}
