import React    from 'react';
import { Link } from 'react-router-dom';

import AppAnchor  from '@components/AppAnchor';
import AppButton  from '@components/AppButton';
import AppFile    from '@components/AppFile';
import AppIcon    from '@components/AppIcon';


export function NavLink (props) {

  return (
    <Link
      className="flex items-center py-2 cursor-pointer
                 text-gray-800 hover:text-blue-600 text-base capitalize font-bold"
      to={props.to}
    >
      { props.icon && <AppIcon file="hero-icons" id={ props.icon } className="w-6 h-6 mr-2" /> }
      { props.name }
    </Link>
  );
}

export function NavMenu (props) {

  const menuType = {
    anchor: AppAnchor,
    button: AppButton,
    file: AppFile,
  };

  const MenuComponent = menuType[props.component];

  return (
    <li key={`${props.name}`} >
      <MenuComponent
        className= {
          `flex items-center py-2 cursor-pointer
           text-gray-800 hover:text-blue-600 text-base capitalize font-bold
           ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
        }

        { ...props }
      >
        { props.icon && <AppIcon file="hero-icons" id={ props.icon } className="w-6 h-6 mr-2" /> }
        { props.name }
      </MenuComponent>
    </li>
  );
}

export function NavGroup (props) {

  return (
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
}
