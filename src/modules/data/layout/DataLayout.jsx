import React from 'react';

import DataStorage from './DataSidebar';


export default function HomeLayout (props) {

  return (
    <div className="flex flex-col items-center">


      {/* MAIN CONTENT: ROUTES */}

      <main className="flex justify-center mt-10 mr-6 px-6 md:px-12 w-full max-w-screen-md" >

        { props.children }

      </main>

      {/* RIGHT-SIDE DRAWER: DATA STORAGE */}

      <DataStorage />

    </div>
  );
}