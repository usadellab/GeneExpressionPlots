import React    from 'react';
import { Link } from 'react-router-dom';

import AppButton from '@components/AppButton';
import AppIcon   from '@components/AppIcon';


export default class Navbar extends React.Component {

  render () {
    return (
      <header className="flex justify-between items-center w-full text-gray-700">

        {/* TOGGLE */}
        <AppButton
          className="md:hidden p-1 cursor-pointer rounded-full"
          type="button"
          onClick={ this.props.onToggle }
        >
          <AppIcon
            className="w-6 h-6"
            file="base"
            id={ this.props.show ? 'hi-close' : 'hi-menu' }
          />
        </AppButton>

        {/* TITLE */}
        <h1 className="flex justify-center p-1 w-full">
          <Link
            className="font-bold text-center text-xl"
            to="/"
          >
            { this.props.brand }
          </Link>
        </h1>

      </header>
    );
  }
}