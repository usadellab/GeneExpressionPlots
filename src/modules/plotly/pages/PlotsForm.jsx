import React, { Component } from 'react';

import AppButton   from '@components/AppButton';
import AppCheckbox from '@components/AppCheckbox';
import AppDatalist from '@components/AppDatalist';
import AppSelect   from '@components/AppSelect';

import { store } from '@/store';

export default class PlotsForm extends Component {

  constructor() {
    super();
    this.state = {
      accessionIds: store.accessionIds,
      accessionIdsView: store.accessionIds.slice(0, 10),
      showlegend: true,
      accession: store.accessionIds[0] ?? '',
      plotType: 'bars'
    };
  }

  selectAccession = (accession) => {
    this.setState({ accession });
    this.searchAccessionIds(accession);
  }

  searchAccessionIds = (accession) => {

    let accessionIdsView = [];
    for (let i = 0; i < store.accessionIds.length; i++) {

      if (store.accessionIds[i].includes(accession))
        accessionIdsView.push(store.accessionIds[i]);

      if (accessionIdsView.length >= 10)
        break;
    }

    this.setState({
      accessionIdsView,
    });
  }


  /**
   * Submit a new plot to the store.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  handleSubmit = (event) => {
    // Prevent default form submit event
    event.preventDefault();
    // Add plot
    store.addPlot(this.state.accession, this.state.showlegend, this.state.plotType);
    // Close the drawer
    this.props.onCancel();
  };

  selectPlotType = (event) => {
    this.setState({ plotType: event.target.value });
  }

  render() {
    return (
      <form className="w-full">

        <div className="w-full md:flex">

          <AppDatalist
            className="w-full md:w-1/2"
            value={ this.state.accession }
            options={ this.state.accessionIdsView }
            onChange={ this.selectAccession }
            onSelect={ this.selectAccession }
          />

          <AppSelect
            className="w-full md:w-1/2 md:ml-2"
            label="Plot type"
            value={ this.state.plotType }
            options={[
              { label: 'Bars',  value: 'bars' },
              { label: 'Individual Curves', value: 'individualCurves' },
              { label: 'Stacked Curves', value: 'stackedCurves' },

            ]}
            onChange={ this.selectPlotType }
          />

        </div>

        <AppCheckbox
          onChange={ (event) => this.setState({ showlegend: event.target.checked }) }
          checked={ this.state.showlegend }
          label="Show legend"
        />

        <div className="mt-8 flex justify-start w-full">

          <AppButton
            className="px-5 py-2 primary-blue"
            type="Submit"
            onClick={ this.handleSubmit }
          >
          Plot Gene
          </AppButton>

          <AppButton
            className="ml-3 py-2 px-5 tertiary-pink"
            type="Button"
            value="Cancel"
            onClick={ this.props.onCancel }
          >
          Cancel
          </AppButton>

        </div>

      </form>
    );
  }
}