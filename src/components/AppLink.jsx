import React     from 'react';
import { Link }  from 'react-router-dom';
import AppRipple from './AppRipple';


export default function AppLink (props) {

  const { className, ...linkProps } = props;

  return (
    <Link
      className={ `relative overflow-hidden flex items-center focus:outline-none ${className}` }
      { ...linkProps }
    >

      { props.children }

      <AppRipple />

    </Link>
  );
}
