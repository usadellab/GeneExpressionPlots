import React    from 'react';
import { Link } from 'react-router-dom';

import IconHome  from '../assets/svg/hi-collection.svg';
import IconPlots from '../assets/svg/hi-chart-square-bar.svg';


export default function MenuBar (props) {

  return (
    <nav className="fixed top-0 flex items-center px-6 py-3 z-50 w-full shadow-lg bg-blue-700" >

      <Link to="/data" className="flex items-center font-medium text-xl text-white" >
        <IconHome className="w-6 h-6" />
        <span className="pl-3">Data</span>
      </Link>

      <Link to="/plots" className="flex items-center ml-12 font-medium text-xl text-white" >
        <IconPlots className="w-6 h-6" />
        <span className="pl-3">Plots</span>
      </Link>

    </nav>
  );
}