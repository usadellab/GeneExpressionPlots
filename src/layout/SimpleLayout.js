import React, { Fragment } from 'react';
//
import MenuBar   from './MenuBar';


export default function SimpleLayout (props) {

  return (
    <Fragment>

      <MenuBar />

      { props.children }

    </Fragment>
  );
}