import React, { useState } from 'react';

import AppButton from '@components/AppButton';
import IconData  from '@assets/svg/hi-menu.svg';

import MenuDrawer from './MenuDrawer';
import NavBar     from './PlotsNavbar';


export default function HomeLayout (props) {

  const [ showStorage, setShowStorage ] = useState(false);

  return (
    <div className="flex flex-col items-center max-w-screen min-h-screen">

      {/* TOP-SIDE BAR: NAVIGATION */}

      <NavBar>

        <AppButton
          className="p-2 mr-4 rounded-full"
          onClick={ (e) => setShowStorage(true) }
        >
          <IconData className="w-6 h-6 text-white" />
        </AppButton>

      </NavBar>

      {/* MAIN CONTENT: ROUTES */}

      <main className="flex flex-wrap p-6 w-full h-full" >

        { props.children }

      </main>

      {/* RIGHT-SIDE DRAWER: DATA STORAGE */}

      <MenuDrawer
        show={ showStorage }
        setShow={ setShowStorage }
      />

    </div>
  );
}