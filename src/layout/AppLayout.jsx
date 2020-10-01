import React, { Fragment }  from 'react';
import NavBar from './AppNavbar';


export default function AppLayout (props) {

  return (
    <Fragment>

      <NavBar />

      <div className="mt-12" >
        { props.children }
      </div>

    </Fragment>
  );
}