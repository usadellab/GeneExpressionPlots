import React    from 'react';
import { Link } from 'react-router-dom';

import AppAnchor from '@components/AppAnchor';
import AppButton from '@components/AppButton';
import AppIcon   from '@components/AppIcon';
import AppFile   from '@components/AppFile';

import { store } from '@/store';


const NavMenu = (props) => {

  const menuType = {
    anchor: AppAnchor,
    button: AppButton,
    file: AppFile,
  };

  const MenuComponent = menuType[props.component];

  return (
    <li key={`${props.name}`} >
      <MenuComponent
        className="flex items-center py-2 cursor-pointer
                   text-gray-800 hover:text-blue-600 text-base capitalize font-bold"
        { ...props }
      >
        { props.icon && <AppIcon file="base" id={ props.icon } className="w-6 h-6 mr-2" /> }
        { props.name }
      </MenuComponent>
    </li>
  );
};

const NavSection = (props) => (
  <div
    className={ `flex flex-col items-center ${props.className}` }
  >
    <Link
      className="md:min-w-full font-bold text-lg uppercase text-gray-600"
      to={ props.to }
    >
      { props.title }
    </Link>

    <ul
      className="flex flex-col items-center justify-center list-none
                 md:min-w-full md:items-start md:ml-4"
    >
      { props.children }
    </ul>
  </div>
);

export default class Sidebar extends React.Component {

  constructor() {
    super();
    this.state = {
      exportUrl: null,
    };
  }

  handleLoadFile = (event) => {

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
      store.groups.push( ...JSON.parse(fr.result) );

    };

    fr.onerror = err => console.log(err);

  };

  handleExport = () => {

    const blob = new Blob([ JSON.stringify(store.groups, null, 2) ], {
      type: 'application/json'
    });

    this.setState({ exportUrl: URL.createObjectURL(blob) });
  }

  handleResetPlots = () => {
    store.clearPlots();
  };

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

        <NavSection className="mt-0" title="Data" to="/data" >

          <NavMenu
            component="button"
            icon="hi-document"
            name="Upload Table"
            onClick={ this.props.showGroupModal }
          />

          <NavMenu
            component="file"
            icon="hi-upload"
            name="Import Data"
            onChange={ this.handleLoadFile }
          />

          <NavMenu
            component="anchor"
            icon="hi-download"
            name="Export Data"
            href={ this.state.exportUrl }
            onClick={ this.handleExport }
            download="data.json"
          />

        </NavSection>


        <NavSection className="mt-6" title="Plots" to="/plots" >

          <NavMenu
            component="button"
            icon="hi-chart-square-bar"
            name="New Plot"
            onClick={ this.props.showPlotsModal }
          />

          <NavMenu
            component="button"
            icon="hi-trash"
            name="Reset Plots"
            onClick={ this.handleResetPlots }
          />

        </NavSection>

        <NavSection className="mt-6" title="Documentation" to="/" >

          <NavMenu
            component="button"
            icon="hi-book"
            name="Guide"
          />

          <NavMenu
            component="button"
            icon="hi-code"
            name="API"
          />

        </NavSection>

      </nav>
    );
  }
}