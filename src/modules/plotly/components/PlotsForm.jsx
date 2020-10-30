import React, { Component } from 'react';

import AppButton   from '@components/AppButton';
import AppSwitch   from '@components/AppSwitch';
import AppDatalist from '@components/AppDatalist';
import AppIcon     from '@components/AppIcon';
import AppSelect   from '@components/AppSelect';
import AppSpinner  from '@components/AppSpinner';

import { store } from '@/store';

export default class PlotsForm extends Component {

  constructor() {
    super();
    this.state = {
      accessionIds: store.accessionIds,
      accessionIdsView: store.accessionIds.slice(0, 10),
      showlegend: true,
      showCaption: store.hasCaptions,
      accessions: [store.accessionIds[0]] ?? [''],
      plotType: 'bars',
      //
      loading: false,
    };
  }

  selectAccession = (accession) => {
    this.setState({ accessions: [accession] });
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
    event.preventDefault();
    this.setState({ loading: true });
    store.addPlot(this.state.accessions, this.state.showlegend, this.state.showCaption, this.state.plotType);
    this.setState({ loading: false });
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
            value={ this.state.accessions[0] }
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

        <div className="mt-4 w-full md:flex">

          <AppSwitch
            className="w-full md:w-1/4 md:ml-2"
            onChange={ (value) => this.setState({ showlegend: value }) }
            checked={ this.state.showlegend }
            label="Show legend"
          />
          {
            store.hasCaptions &&
            <AppSwitch
              className="w-full md:w-1/4 md:ml-2"
              onChange={ (value) => this.setState({ showCaption: value }) }
              checked={ this.state.showCaption }
              label="Show caption"
            />
          }

        </div>

        <div className="mt-8 flex justify-start w-full">

          <AppButton
            className="px-5 py-2 primary-blue"
            type="Submit"
            onClick={ this.handleSubmit }
          >
            {
              this.state.loading
                ? <AppSpinner className="mr-3 h-6 w-6 text-white" />
                : <AppIcon file="hero-icons" id="chart-square-bar" className="w-6 h-6 mr-3"/>
            }
            {
              this.state.loading
                ? 'Plotting'
                : 'Plot Gene'
            }
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