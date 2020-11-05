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
      accessions: [ store.accessionIds[0] ?? '' ],
      accessionIds: store.accessionIds,
      accessionIdsView: store.accessionIds.slice(0, 10),
      showlegend: true,
      showCaption: store.hasCaptions,
      plotType: 'bars',
      colorBy: 'group',
      //
      loading: false,
    };
  }

  /* AUXILIARY */

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

  /* EVENT HANDLERS */

  onAccessionDataListChange = (accession, index) => {

    this.setState(state => {

      const accessions = state.accessions;
      accessions[index] = accession;

      return {
        accessions,
      };
    });
    this.searchAccessionIds(accession);
  }

  onAccessionDatalistIconClick = (action, index) => {

    if (action === 'add') this.setState(state => ({
      accessions: [ ...state.accessions, '' ]
    }));

    else if (action === 'remove') this.setState(state => ({
      accessions: state.accessions.filter((_, i) => i !== index)
    }));
  }

  /**
   * Submit a new plot to the store.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  onPlotGeneButtonClick = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    store.addPlot(
      this.state.accessions,
      this.state.showlegend,
      this.state.showCaption,
      this.state.plotType,
      this.state.colorBy
    );
    this.setState({ loading: false });
    this.props.onCancel();
  };

  onSelectPlotTypeChange = (event) => {
    this.setState({ plotType: event.target.value });
  }

  onSelectColorByChange = (event) => {
    this.setState({ colorBy: event.target.value });
  }

  render() {
    return (
      <form
        className="overflow-y-auto w-full max-h-lg px-6 py-4 flex-auto
                   text-gray-600 text-lg leading-relaxed"
      >

        <AppSelect
          label="Plot type"
          value={ this.state.plotType }
          options={[
            { label: 'Bars',  value: 'bars' },
            { label: 'Individual Curves', value: 'individualCurves' },
            { label: 'Stacked Curves', value: 'stackedCurves' },

          ]}
          onChange={ this.onSelectPlotTypeChange }
        />

        {
          this.state.plotType === 'stackedCurves' &&
          <AppSelect
            label="Color by"
            value={ this.state.colorBy }
            options={[
              { label: 'group', value: 'group' },
              { label: 'gene',  value: 'gene', disabled: this.state.accessions.length === 1 },
            ]}
            onChange={ this.onSelectColorByChange }
            // disabled={this.state.accessions.length === 1}
          />
        }

        {
          this.state.accessions.map((acc, index) => {

            const isLast = this.state.accessions.length === index+1;

            return (
              /**
               * We need to use `index` as key, since `acc` will mutate
               * each time the user changes the input, causing the element
               * to re-render every time a key is pressed and losing focus.
               */
              <div
                key={ index }
                className="flex items-center mt-4"
              >
                <AppDatalist
                  label={ isLast ? 'Accession ID' : null }
                  value={ this.state.accessions[index] }
                  options={ this.state.accessionIdsView }
                  onChange={ (accession) => this.onAccessionDataListChange(accession, index) }
                  onSelect={ (accession) => this.onAccessionDataListChange(accession, index) }
                  onClick={ () => this.searchAccessionIds(acc) }
                />

                <AppIcon
                  className={
                    `ml-4 w-12 h-12 cursor-pointer
                     ${ isLast ? 'text-green-700 mb-8' : 'text-pink-700'}`
                  }
                  file="hero-icons"
                  id={ isLast ? 'plus' : 'minus' }
                  onClick={ () => this.onAccessionDatalistIconClick(
                    isLast ? 'add' : 'remove', index
                  ) }
                />

              </div>
            );
          })
        }
        <div className="mt-4 w-full md:flex">

          <AppSwitch
            className="w-1/2"
            onChange={ (value) => this.setState({ showlegend: value }) }
            checked={ this.state.showlegend }
            label="Legend"
          />
          {
            store.hasCaptions &&
            <AppSwitch
              className="w-1/2 md:ml-2"
              onChange={ (value) => this.setState({ showCaption: value }) }
              checked={ this.state.showCaption }
              label="Caption"
            />
          }

        </div>

        <div className="mt-8 flex justify-start w-full">

          <AppButton
            className="px-5 py-2 primary-blue"
            type="Submit"
            onClick={ this.onPlotGeneButtonClick }
          >
            {
              this.state.loading
                ? <AppSpinner className="mr-2 h-6 w-6 text-white" />
                : <AppIcon file="hero-icons" id="chart-square-bar" className="w-6 h-6 mr-2"/>
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