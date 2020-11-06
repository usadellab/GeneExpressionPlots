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
      accessionIds: [ store.accessionIds[0] ?? '' ],
      accessionIdsView: store.accessionIds.slice(0, 10),
      showlegend: true,
      showCaption: store.hasCaptions,
      plotType: 'bars',
      colorBy: 'group',
      //
      loading: false,
      validForm: true,
    };
  }

  /* AUXILIARY */

  searchAccessionIds = (accession) => {

    // Flag whether the current accession id is valid for submission
    this.setState({ validForm: store.accessionIds.includes(accession) });

    // Update the search window with the accession matching ids
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

    // Update the internal accession id with the new input value
    this.setState(state => {

      const accessionIds = state.accessionIds;
      accessionIds[index] = accession;

      return {
        accessionIds,
      };
    });

    // Update the search window with the new matching ids
    this.searchAccessionIds(accession);
  }

  onAccessionDatalistIconClick = (action, index) => {

    if (action === 'add') this.setState(state => ({
      accessionIds: [ ...state.accessionIds, '' ],
      validForm: false,
    }));

    else if (action === 'remove') this.setState(state => ({
      accessionIds: state.accessionIds.filter((_, i) => i !== index)
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
      this.state.accessionIds,
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
        className="overflow-y-auto w-full max-h-xl px-6 py-4 flex-auto
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
              { label: 'gene',  value: 'gene', disabled: this.state.accessionIds.length === 1 },
            ]}
            onChange={ this.onSelectColorByChange }
          />
        }

        {
          this.state.accessionIds.map((accession, index) => {

            const isLast = this.state.accessionIds.length === index+1;

            return (
              /**
               * We need to use `index` as key, since `accession` will mutate
               * each time the user changes the input, causing the element
               * to re-render every time a key is pressed and losing focus.
               */
              <div
                key={ index }
                className="flex items-center mt-4"
              >
                <AppDatalist
                  label={ isLast ? 'Accession ID' : null }
                  value={ this.state.accessionIds[index] }
                  options={ this.state.accessionIdsView }
                  onChange={ (accession) => this.onAccessionDataListChange(accession, index) }
                  onSelect={ (accession) => this.onAccessionDataListChange(accession, index) }
                  onFocus={ () => this.searchAccessionIds(accession) }
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
            className={
              `px-5 py-2 shadow-outer text-white
              ${ this.state.validForm ?'bg-blue-700' : 'bg-gray-700 cursor-not-allowed'}`
            }
            type="Submit"
            disabled={ !this.state.validForm }
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