import React, { Fragment } from 'react';

import IconLeft    from '@assets/svg/hi-chevron-left.svg';
import AppButton   from '@components/AppButton';
import AppCheckbox from '@components/AppCheckbox';
import AppDrawer   from '@components/AppDrawer';
import AppDatalist from '@components/AppDatalist';


import { store } from '@/store';


/**
 * @typedef {Object} DataStorageProps Properties object for the DataStorage component.
 * @property {() => void} onLoad callback after loading files
 *
 * @param {DataStorageProps} props component properties
 */
export default class PlotMenuDrawer extends React.Component {

  constructor () {

    super();

    this.state = {
      accessionIds: store.accessionIds,
      accessionIdsView: store.accessionIds.slice(0, 10),
      showDrawer: false,
      showlegend: false,
      accession: store.accessionIds[0] ?? '',
    };

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

  selectAccession = (accession) => {

    this.setState({ accession });
    this.searchAccessionIds(accession);
  }

  /**
   * Submit a new plot to the store.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  handleSubmit = (event) => {

    // Prevent default form submit event
    event.preventDefault();

    // Add plot
    store.addBarPlot(this.state.accession, this.state.showlegend);

    // Close the drawer
    this.setState({ showDrawer: false });
  };

  handleReset = (event) => {

    // Close the drawer
    this.setState({ showDrawer: false });

  };

  render () {
    return (
      <Fragment>
        <nav
          className="fixed right-0 py-4
                 flex flex-col items-center justify-center
                 h-full bg-gray-400"
        >
          <AppButton
            className="rounded-full h-full"
            onClick={ () => this.setState({ showDrawer: true }) }
          >
            <IconLeft className="w-6 h-6 text-white" />
          </AppButton>

        </nav>

        <AppDrawer
          className="z-50 p-3 w-1/2 md:w-1/3 lg:w-1/4"
          show={ this.state.showDrawer }
          setShow={ () => this.setState({ showDrawer: false }) }
        >
          <form className="flex flex-col w-full">

            <AppDatalist
              value={ this.state.accession }
              options={ this.state.accessionIdsView }
              onChange={ this.selectAccession }
              onSelect={ this.selectAccession }
            />

            {/* <AppSelect
            className="w-full"
            label="Accession ID"
            value={ accession }
            options={ store.accessionIds.map(name => ({ label: name, value: name })) }
            onChange={ (event) => setAccession(event.target.value) }
          /> */}

            <AppCheckbox
              onChange={ (event) => this.setState({ showlegend: event.target.checked }) }
              label="Show legend"
            />

            <div className="mt-8 flex justify-end w-full">

              <AppButton
                className="px-5 py-2 primary-blue"
                type="Submit"
                onClick={ this.handleSubmit }
              >
              Save
              </AppButton>

              <AppButton
                className="px-5 py-2 primary-pink ml-3"
                type="Button"
                value="Reset"
                onClick={ this.handleReset }
              >
              Reset
              </AppButton>

            </div>

          </form>
        </AppDrawer>
      </Fragment>
    );
  }
}