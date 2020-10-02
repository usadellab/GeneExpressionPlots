import React from 'react';

import MenuDrawer from './PlotsDrawer';


export default class PlotsLayout extends React.Component {

  render () {
    return (
      <div className="flex max-w-screen min-h-full">


        {/* MAIN CONTENT: ROUTES */}

        <main className="flex flex-wrap p-6 mt-10 w-11/12 h-full" >

          { this.props.children }

        </main>

        {/* RIGHT-SIDE DRAWER: DATA STORAGE */}

        <MenuDrawer />

      </div>
    );
  }
}