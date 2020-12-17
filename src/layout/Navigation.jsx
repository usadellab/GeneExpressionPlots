import React from 'react';
import { withRouter } from 'react-router';

import AppOverlay from '@components/AppOverlay';
import AppSpinner from '@components/AppSpinner';
import {
  NavGroup,
  NavMenu,
  NavLink,
} from './NavigationItem';

import { observer }  from 'mobx-react';
import { dataTable } from '@/store/data-store';
import { plotStore } from '@/store/plot-store';
import { settings }  from '@/store/settings';


@observer
class AppNavigation extends React.Component {

  constructor() {
    super();
    this.state = {
      exportUrl: null,
      loading: false,
    };
  }

  /* AUXILIARY */

  /**
   * Trigger a route change if the current location does not match the current route
   * @param {string} route route name
   */
  changeRoute = (route) => {
    if (this.props.location.pathname !== `/${route}`)
      this.props.history.push(`/${route}`);
  }

  /* DATA MENU EVENTS */

  onUploadReplicateTableClick = () => {
    this.props.showGroupModal();
    this.changeRoute('data');
  }

  onUploadExpressionTableClick = () => {
    this.props.showTableModal();
    this.changeRoute('data');
  }

  onUploadInfoMenuClick = () => {
    this.props.showInfoModal();
    this.changeRoute('data');
  }

  // onExportDataMenuClick = () => {

  //   const data = {
  //     data: store.groups,
  //     captions: store.captions,
  //     image: store.image,
  //   };

  //   const blob = new Blob([ JSON.stringify(data, null, 2) ], {
  //     type: 'application/json'
  //   });

  //   this.setState({ exportUrl: URL.createObjectURL(blob) });

  //   this.changeRoute('data');
  // }

  // onImportDataMenuClick = (event) => {

  //   this.setState({ loading: true });

  //   // Get the file ref
  //   const file = event.target.files.item(0);

  //   // Reset file input (allow consecutive uploads of the same file)
  //   event.target.value = null;

  //   // Accept zipped files only
  //   if (!file || file.type !== 'application/zip') {
  //     console.error(`Invalid file type: ${file.type}`);
  //     this.setState({ loading: false });
  //     return;
  //   }


  //   // Use FileReader API to parse the input file
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     // const { data, captions, image } = JSON.parse(reader.result);
  //     // if (data)     store.assignData(data);
  //     // if (captions) store.assignCaptions(captions);
  //     // if (image)    store.assignImage(image);
  //   };

  //   reader.onloadend = () => {
  //     this.setState({ loading: false });
  //     this.changeRoute('data');
  //   };

  //   reader.onerror = err => {
  //     console.log(err);
  //     this.setState({ loading: false });
  //   };

  //   reader.readAsText(file, 'utf-8');
  // }

  onClearDataMenuClick = () => {
    this.changeRoute('data');
    dataTable.clearData();
  };

  /* PLOT MENU EVENTS */

  /**
   * Clear the current plots.
   */
  onClearPlotsMenuClick = () => {
    plotStore.clearPlots();
    this.changeRoute('plots');
  };

  /**
   * Clear the current legend image.
   */
  onClearImageMenuClick = () => {
    plotStore.clearImage();
    this.changeRoute('plots');
  }

  /**
   * Convert the user image to an image URL and assign it in the store.
   * @param {React.FormEvent<HTMLInputElement>} event file input event
   */
  onNewImageMenuClick = (event) => {

    const reader = new FileReader();
    reader.onload = () => plotStore.loadImage(reader.result);
    reader.onloadend = () => this.changeRoute('plots');
    reader.onerror = (error) => console.error(error);
    reader.readAsDataURL(event.target.files[0]);

    this.changeRoute('plots');
  }

  /**
   * Show the Plots form modal.
   */
  onNewPlotMenuClick = () => {
    this.changeRoute('plots');
    this.props.showPlotsModal();
  }

  /* RENDER */

  render () {
    return (
      <nav
        className={
          `absolute top-0 left-0 right-0 z-40 overflow-x-hidden
           flex flex-col items-center justify-center
           mt-20 py-5 shadow-outer rounded bg-white
           md:relative md:flex md:flex-col
           md:mt-0 md:items-stretch md:shadow-none
           ${this.props.show ? 'visible' : 'hidden'}`

        }
        onClick={ this.props.onClick }
      >
        {/* LOADING SPINNER */}
        {
          (this.state.loading || settings.isPreloading) &&
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
            !settings.preloaded.data &&
            <NavMenu
              component="button"
              icon="table"
              name="Upload Replicate Table"
              onClick={ this.onUploadReplicateTableClick }
            />
          }

          {
            !settings.preloaded.data &&
            <NavMenu
              component="button"
              icon="table"
              name="Upload Expression Table"
              onClick={ this.onUploadExpressionTableClick }
            />
          }

          {
            !settings.preloaded.info &&
            <NavMenu
              component="button"
              icon="annotation"
              name="Upload Info Table"
              onClick={ this.onUploadInfoMenuClick }
            />
          }

          {/* <NavMenu
            component="anchor"
            icon="download"
            name="Export Data"
            download="data.json"
            href={ this.state.exportUrl }
            onClick={ this.onExportDataMenuClick }
          /> */}

          {/* {
            !settings.preloaded &&
            <NavMenu
              component="file"
              icon="upload"
              name="Import Data"
              onChange={ this.onImportDataMenuClick }
            />
          } */}

          {
            !settings.preloaded.data &&
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
            disabled={ !dataTable.hasData }
            onClick={ this.onNewPlotMenuClick }
          />

          {
            !settings.preloaded.image &&
            <NavMenu
              component="file"
              icon="photograph"
              accept="image/*"
              name="New Image"
              onChange={ this.onNewImageMenuClick }
            />
          }

          <NavMenu
            component="button"
            icon="trash"
            name="Clear Plots"
            disabled={ !plotStore.hasPlots }
            onClick={ this.onClearPlotsMenuClick }
          />

          {
            !settings.preloaded.image &&
            <NavMenu
              component="button"
              icon="trash"
              name="Clear Image"
              disabled={ !settings.hasImage }
              onClick={ this.onClearImageMenuClick }
            />
          }

        </NavGroup>

        {/* TOOLS */}
        <NavGroup className="mt-6" title="Tools" to="/" >

          <NavLink
            to="/tools/gene-browser"
            icon="search"
            name="Gene Browser"
            disabled={ !dataTable.hasData }
            onClick={ () => {} }
          />

        </NavGroup>

        {/* DOCUMENTATION */}
        <NavGroup className="mt-6" title="Documentation" to="/" >

          <NavMenu
            component="anchor"
            icon="book"
            name="Guide"
            href="https://zendro-dev.gitbook.io/geneexpressionplots/documentation/user-manual"
          />

          <NavMenu
            component="anchor"
            icon="code"
            name="API"
            href="https://zendro-dev.gitbook.io/geneexpressionplots/documentation/api"
          />

        </NavGroup>

      </nav>
    );
  }
}

export default withRouter(AppNavigation);