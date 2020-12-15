import React, { Component } from 'react';
import { autorun } from 'mobx';
import { store } from '@/store';
import { escapeRegExp } from '@/utils/validation';

import AppModal from '@/components/AppModal2';
import AppNumber from '@/components/AppNumber';
import AppSelect from '@/components/AppSelect';
import AppText from '@/components/AppText';

import GeneDetails from '../components/GeneDetails';
import AppIcon from '@/components/AppIcon';
import AppButton from '@/components/AppButton';

export default class GeneBrowser extends Component {

  constructor () {
    super();
    this.state = {
      geneView: [],
      searchId: '',
      pageOffset: 1,
      pageMax: 1,
      countView: 20,
      showGeneDetails: false,
    };
  }

  /* AUXILIARY */

  computeGeneView = () => {

    const regexp = new RegExp( escapeRegExp(this.state.searchId), 'i' );

    const accessionIds = store.accessionIds.reduce((array, accessionId) => {

      const matchAccesion = accessionId.search(regexp) > -1;

      const description = store.captions[accessionId];
      const matchCaption = description
        ? description.search(regexp) > -1
        : false;

      if (matchAccesion || matchCaption) {
        array.push({
          accessionId,
          description,
        });
      }

      return array;
    }, []);

    const countView = parseInt(this.state.countView);
    const start = (this.state.pageOffset-1) * countView;
    const end = this.state.pageOffset * countView;

    const geneView = accessionIds.slice(start, end);
    const pageMax = Math.ceil(accessionIds.length / this.state.countView) || 1;

    this.setState(({ geneView, pageMax }));

  }

  /* LYFECYCLE */

  componentDidMount () {
    this.disposeGeneViewListener = autorun( this.computeGeneView );
  }

  componentDidUpdate (prevProps, prevState) {

    if( prevState.searchId !== this.state.searchId
        || prevState.pageOffset !== this.state.pageOffset
        || prevState.countView !== this.state.countView
    ) {
      this.computeGeneView();
    }

  }

  componentWillUnmount () {
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
  }

  /**
   * Re-evaluate the captions result, including only accessions ids matching fully or
   * partially the current _searchId_ state property. This event also re-calculates the
   * _countOffset_ and _countView_ state properties.
   * @param {React.KeyboardEvent} event
   */
  onGeneSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      this.setState({ pageOffset: 1, searchId: event.target.value});
    }
  }

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

  }

  /* ACTIONS */

  /**
   * Toggle the gene details modal visibility.
   * @param {React.MouseEvent<HTMLDivElement>} event
   */
  toggleGeneDetails = (accessionId) => {
    this.setState({ showGeneDetails: accessionId });
  }

  /* RENDER */

  render() {
    return (
      <div className="m-6">

        <div className="mt-4 flex flex-col lg:flex-row bg-white px-6 py-5">

          <AppText
            className="lg:w-3/4 w-full"
            id="gene-browser-search"
            label="Search accession"
            onKeyDown={ this.onGeneSearchSubmit }
          />

          <div className="flex flex-col flex-grow sm:flex-row">
            <AppNumber
              className="w-full mt-4 sm:w-1/2 lg:ml-3 lg:mt-0"
              label={ `Page ${this.state.pageOffset}/${this.state.pageMax}`}
              min={ 1 }
              max={ this.state.pageMax }
              required={ true }
              value={ this.state.pageOffset }
              onChange={ this.onPageOffsetChange }
            />

            <AppSelect
              className="w-full mt-4 sm:ml-3 sm:w-1/2 lg:mt-0"
              id="gene-browser-search"
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

        </div>

        <div className="bg-white mt-6">
          {
            this.state.geneView.map(({ accessionId, description }) => (

              <div
                className="group flex items-center p-6 border border-transparent hover:bg-yellow-100 odd:bg-gray-100"
                key={ accessionId }
                onDoubleClick={ () => this.toggleGeneDetails(accessionId) }
              >

                <div className="w-full">
                  <div className="font-bold">{ accessionId }</div>
                  <div className="mx-6">{ description ?? 'No description exists for this gene.' }</div>
                </div>

                <AppButton onClick={ () => this.toggleGeneDetails(accessionId) } >
                  <AppIcon
                    className="ml-4 w-6 h-6 text-gray-500 invisible group-hover:visible"
                    file="hero-icons"
                    id="eye"
                  />
                </AppButton>

              </div>

            ))
          }
        </div>

        <AppModal
          className="flex flex-col w-full h-full md:w-5/6 md:h-5/6 lg:w-3/4 2xl:w-1/2"
          title={ this.state.showGeneDetails }
          showModal={ this.state.showGeneDetails }
          hideModal={ () => this.toggleGeneDetails(false) }
        >
          <GeneDetails accessionId={ this.state.showGeneDetails } />
        </AppModal>

      </div>
    );
  }
}
