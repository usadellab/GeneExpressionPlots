import React from 'react';
import { withRouter } from 'react-router';

import AppOverlay from '@components/AppOverlay';
import AppSpinner from '@components/AppSpinner';
import { NavGroup, NavMenu, NavLink } from './NavigationItem';

import { observer } from 'mobx-react';
import { dataTable, infoTable } from '@/store/data-store';
import { plotStore } from '@/store/plot-store';
import { settings } from '@/store/settings';

import JSZip from 'jszip';
import { readTable } from '@/utils/parser';

import { saveAs } from 'file-saver';

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
  };

  /* DATA MENU EVENTS */

  onUploadReplicateTableClick = () => {
    this.props.showGroupModal();
    this.changeRoute('data');
  };

  onUploadExpressionTableClick = () => {
    this.props.showTableModal();
    this.changeRoute('data');
  };

  onUploadInfoMenuClick = () => {
    this.props.showInfoModal();
    this.changeRoute('data');
  };

  onExportDataMenuClick = async () => {
    const data = {
      expression: dataTable.dataFrametoString(
        settings.tableSettings.expression_field_sep
      ),
      info: infoTable.hasData
        ? infoTable.dataFrametoString(settings.tableSettings.info_field_sep)
        : null,
    };

    var zip = new JSZip();
    zip.file(
      'GXP_settings.json',
      JSON.stringify(settings.tableSettings, null, 2)
    );
    zip.file('expression_table.txt', data.expression);
    if (data.info) zip.file('info_table.txt', data.info);
    if (plotStore.image)
      zip.file('image.png', plotStore.image.split('base64,')[1], {
        base64: true,
      });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'GXP_data.zip');
    });
  };

  onImportDataMenuClick = async (event) => {
    this.setState({ loading: true });
    // Get the file ref
    const file = event.target.files.item(0);

    const zip = new JSZip();

    let zipImport = await zip.loadAsync(file);
    if (!zipImport.files['GXP_settings.json']) {
      this.setState({ loading: false });
      throw new Error(
        'The provided Import does not contain a GXP_settings.json file.'
      );
    }

    if (!zipImport.files['expression_table.txt']) {
      this.setState({ loading: false });
      throw new Error(
        'The provided Import does not contain an expression_table.txt file.'
      );
    }

    let tableSettings = await zipImport.files['GXP_settings.json'].async(
      'string'
    );
    settings.loadTableSettings(tableSettings);

    let expressionTable = await zipImport.files['expression_table.txt'].async(
      'string'
    );
    dataTable.loadFromObject(
      readTable(expressionTable, {
        fieldSeparator: settings.tableSettings.expression_field_sep,
        rowNameColumn: 0,
      }),
      {
        multiHeader: settings.tableSettings.expression_header_sep,
      }
    );

    let infoFile = await zipImport.files['info_table.txt'];
    if (infoFile) {
      infoTable.loadFromObject(
        readTable(await infoFile.async('string'), {
          fieldSeparator: settings.tableSettings.info_field_sep,
          rowNameColumn: 0,
        })
      );
    }

    let imageFile = await zipImport.files['image.png'];
    if (imageFile) {
      let imgsrc = await imageFile.async('base64');
      imgsrc = 'data:image/png;base64, ' + imgsrc;
      plotStore.loadImage(imgsrc);
    }

    this.setState({ loading: false });
    this.changeRoute('data');
  };

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
  };

  /**
   * Convert the user image to an image URL and assign it in the store.
   * @param {React.FormEvent<HTMLInputElement>} event file input event
   */
  onNewImageMenuClick = (event) => {
    const file = event.target.files[0];
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = () => plotStore.loadImage(reader.result);
    reader.onloadend = () => this.changeRoute('plots');
    reader.onerror = (error) => console.error(error);
    reader.readAsDataURL(file);

    this.changeRoute('plots');
  };

  /**
   * Show the Plots form modal.
   */
  onNewPlotMenuClick = () => {
    this.changeRoute('plots');
    this.props.showPlotsModal();
  };

  /* RENDER */

  render() {
    return (
      <nav
        className={`absolute top-0 left-0 right-0 z-40 overflow-x-hidden
           flex flex-col items-center justify-center
           mt-20 py-5 shadow-outer rounded bg-white
           lg:relative lg:flex lg:flex-col
           lg:mt-0 lg:items-stretch lg:shadow-none
           ${this.props.show ? 'visible' : 'hidden'}`}
        onClick={this.props.onClick}
      >
        {/* LOADING SPINNER */}
        {(this.state.loading || settings.isPreloading) && (
          <AppOverlay
            className="flex flex-col justify-center items-center rounded-lg py-4 px-6"
            overlayClass="bg-gray-600"
          >
            <AppSpinner className="mt-2 w-20 h-20 text-blue-700" />
            <span className="uppercase mt-4 font-semibold">
              {this.state.loading ? 'Importing Data' : 'Preloading Data'}
            </span>
          </AppOverlay>
        )}

        {/* DATA */}
        <NavGroup className="mt-0" title="Data" to="/data">
          {!settings.preloaded.data && (
            <NavMenu
              component="button"
              icon="table"
              name="Upload Replicate Table"
              onClick={this.onUploadReplicateTableClick}
            />
          )}

          {!settings.preloaded.data && (
            <NavMenu
              component="button"
              icon="table"
              name="Upload Expression Table"
              onClick={this.onUploadExpressionTableClick}
            />
          )}

          {!settings.preloaded.info && (
            <NavMenu
              component="button"
              icon="annotation"
              name="Upload Info Table"
              onClick={this.onUploadInfoMenuClick}
            />
          )}

          <NavMenu
            component="button"
            icon="download"
            name="Export Data"
            // download="GXP-data.json"
            // href={ this.state.exportUrl }
            onClick={this.onExportDataMenuClick}
          />

          {!settings.preloaded.data && (
            <NavMenu
              component="file"
              icon="upload"
              name="Import Data"
              onChange={this.onImportDataMenuClick}
            />
          )}

          {!settings.preloaded.data && (
            <NavMenu
              component="button"
              icon="trash"
              name="Clear Data"
              onClick={this.onClearDataMenuClick}
            />
          )}
        </NavGroup>

        {/* PLOTS */}
        <NavGroup className="mt-6" title="Plots" to="/plots">
          <NavMenu
            component="button"
            icon="chart-square-bar"
            name="New Plot"
            disabled={!dataTable.hasData}
            onClick={this.onNewPlotMenuClick}
          />

          {!settings.preloaded.image && (
            <NavMenu
              component="file"
              icon="photograph"
              accept="image/*"
              name="New Image"
              onChange={this.onNewImageMenuClick}
            />
          )}

          <NavMenu
            component="button"
            icon="trash"
            name="Clear Plots"
            disabled={!plotStore.hasPlots}
            onClick={this.onClearPlotsMenuClick}
          />

          {!settings.preloaded.image && (
            <NavMenu
              component="button"
              icon="trash"
              name="Clear Image"
              disabled={!plotStore.hasImage}
              onClick={this.onClearImageMenuClick}
            />
          )}
        </NavGroup>

        {/* TOOLS */}
        <NavGroup className="mt-6" title="Tools" to="/">
          <NavLink
            to="/tools/gene-browser"
            icon="search"
            name="Gene Browser"
            disabled={!dataTable.hasData}
            onClick={() => {}}
          />
        </NavGroup>

        {/* DOCUMENTATION */}
        <NavGroup className="mt-6" title="Documentation" to="/">
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

          <NavMenu
            component="anchor"
            icon="document-duplicate"
            name="Example Data"
            href="https://github.com/usadellab/GeneExpressionPlots/tree/master/examples"
          />
        </NavGroup>
      </nav>
    );
  }
}

export default withRouter(AppNavigation);
