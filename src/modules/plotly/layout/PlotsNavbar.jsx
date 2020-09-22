import React    from 'react';
import { Link } from 'react-router-dom';

import IconHome  from '../../../assets/svg/hi-home.svg';


export default function MenuBar (props) {

  return (
    <header
      className="fixed flex justify-between items-center z-10 p-2
                 w-full shadow-lg bg-blue-700"
    >

      <Link to="/" className="flex items-center ml-4 font-medium text-xl text-white" >
        <IconHome className="w-6 h-6" />
        <span className="pl-3">Expression Plots</span>
      </Link>

      { props.children }

    </header>

  );
}
