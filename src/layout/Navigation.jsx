import React          from 'react';
import { withRouter } from 'react-router';

import AppOverlay from '@components/AppOverlay';
import AppSpinner from '@components/AppSpinner';

import {
  NavLink,
  NavGroup,
  NavMenu,
} from './NavigationItem';

import { store }    from '@/store';
import { observer } from 'mobx-react';


@observer
class AppNavigation extends React.Component {

  constructor() {
    super();
    this.state = {
      exportUrl: null,
      loading: false,
    };
  }

  /* DATA MENU EVENTS */

  onClearDataMenuClick = () => {
    store.clearData();
    if (this.props.location.pathname !== '/data')
      this.props.changeRoute('data');
  };

  onExportDataMenuClick = () => {

    const blob = new Blob([ JSON.stringify(store.groups, null, 2) ], {
      type: 'application/json'
    });

    this.setState({ exportUrl: URL.createObjectURL(blob) });

    this.props.changeRoute('data');
  }

  onImportDataMenuClick = (event) => {

    this.setState({ loading: true });

    // Get the file ref
    const file = event.target.files.item(0);

    // Reset file input (allow consecutive uploads of the same file)
    event.target.value = null;

    // Accept JSON mime-type only
    if (!file || file.type !== 'application/json') return;

    // Use FileReader API to parse the input file
    const reader = new FileReader();

    reader.onload = () => {
      const { data, captions } = JSON.parse(reader.result);
      if (data)
        store.groups.push( ...data );
      if (captions)
        Object.assign(store.captions, captions);
    };

    reader.onloadend = () => {
      this.setState({ loading: false });
      if (this.props.location.pathname !== '/data')
        this.props.changeRoute('data');
    };

    reader.onerror = err => {
      console.log(err);
      this.setState({ loading: false });
    };

    reader.readAsText(file, 'utf-8');
  }

  onUploadCaptionsMenuClick = (event) => {

    // Get the file ref
    const file = event.target.files.item(0);

    // Reset file input (allow consecutive uploads of the same file)
    event.target.value = null;

    // Accept JSON mime-type only
    if (!file || file.type !== 'application/json') return;

    // Use FileReader API to parse the input file
    const fr = new FileReader();

    fr.readAsText(file, 'utf-8');

    fr.onload = () => {

      // Update store
      Object.assign(store.captions, JSON.parse(fr.result));

    };

    fr.onerror = err => console.log(err);
  }

  /* PLOT MENU EVENTS */

  onClearPlotsMenuClick = () => {
    store.clearPlots();
    this.props.changeRoute('plots');
  };

  onClearImageMenuClick = () => {
    if (this.props.location.pathname !== '/plots')
      this.props.changeRoute('plots');
    store.clearImage();
  }

  onNewImageMenuClick = (event) => {
    const img = URL.createObjectURL(event.target.files[0]);
    store.assignImage(img);
  }

  /* RENDER */

  render () {
    return (
      <nav
        className={
          `absolute top-0 left-0 right-0 z-40 overflow-x-hidden
           flex flex-col items-center justify-center
           mt-20 mx-3 py-5 shadow-outer rounded bg-white
           md:relative md:flex md:flex-col
           md:mt-0 md:items-stretch md:shadow-none
           ${this.props.show ? 'visible' : 'hidden'}`

        }
        onClick={ this.props.onClick }
      >
        {/* LOADING SPINNER */}
        {
          (this.state.loading || store.isPreloading) &&
          <AppOverlay
            className="flex flex-col justify-center items-center rounded-lg py-4 px-6"
            overlayClass="bg-gray-600"
          >
            <AppSpinner className="mt-2 w-20 h-20 text-blue-700" />
            <span className="uppercase mt-4 font-semibold">
              {
                this.state.loading
                  ? 'Importing Data'
                  : 'Preloading Data'
              }
            </span>
          </AppOverlay>
        }

        {/* DATA */}
        <NavGroup className="mt-0" title="Data" to="/data" >

          {
            !store.preloaded &&
            <NavMenu
              component="button"
              icon="table"
              name="Upload Table"
              onClick={ this.props.showGroupModal }
            />
          }

          {
            !store.preloaded &&
            <NavMenu
              component="file"
              icon="annotation"
              name="Upload Captions"
              onChange={ this.onUploadCaptionsMenuClick }
            />
          }

          <NavMenu
            component="anchor"
            icon="download"
            name="Export Data"
            download="data.json"
            href={ this.state.exportUrl }
            onClick={ this.onExportDataMenuClick }
          />

          {
            !store.preloaded &&
            <NavMenu
              component="file"
              icon="upload"
              name="Import Data"
              onChange={ this.onImportDataMenuClick }
            />
          }

          {
            !store.preloaded &&
            <NavMenu
              component="button"
              icon="trash"
              name="Clear Data"
              onClick={ this.onClearDataMenuClick }
            />
          }

        </NavGroup>

        {/* PLOTS */}
        <NavGroup className="mt-6" title="Plots" to="/plots" >

          <NavMenu
            component="button"
            icon="chart-square-bar"
            name="New Plot"
            disabled={ !store.hasData }
            onClick={ this.props.showPlotsModal }
          />

          {
            !store.preloaded &&
            <NavMenu
              component="file"
              icon="photograph"
              accept="image/*"
              name="New Image"
              disabled={ !store.hasData }
              onChange={ this.onNewImageMenuClick }
            />
          }

          <NavMenu
            component="button"
            icon="trash"
            name="Clear Plots"
            disabled={ !store.hasData }
            onClick={ this.onClearPlotsMenuClick }
          />

          {
            !store.preloaded &&
            <NavMenu
              component="button"
              icon="trash"
              name="Clear Image"
              disabled={ !store.hasData }
              onClick={ this.onClearImageMenuClick }
            />
          }

        </NavGroup>

        {/* DOCUMENTATION */}
        <NavGroup className="mt-6" title="Documentation" to="/" >

          <NavLink
            icon="book"
            name="Guide"
            to="/"
          />

          <NavLink
            icon="code"
            name="API"
            to="/api"
          />

        </NavGroup>

      </nav>
    );
  }
}

export default withRouter(AppNavigation);