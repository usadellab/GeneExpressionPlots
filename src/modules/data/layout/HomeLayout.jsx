import React, { useState } from 'react';

import AppButton from '@components/AppButton';

import IconData    from '../assets/svg/hi-database.svg';
import DataStorage from './StorageDrawer';
import NavBar      from './NavBar';


export default function HomeLayout (props) {

  const [ showStorage, setShowStorage ] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen">

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

      <main className="flex justify-center mt-10 px-6 md:px-12 w-full max-w-screen-md" >

        { props.children }

      </main>

      {/* RIGHT-SIDE DRAWER: DATA STORAGE */}

      <DataStorage
        show={ showStorage }
        setShow={ setShowStorage }
      />

    </div>
  );
}