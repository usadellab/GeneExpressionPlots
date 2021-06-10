import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AppAnchor from '@components/AppAnchor';
import AppButton from '@components/AppButton';
import AppFile from '@components/AppFile';
import AppIcon from '@components/AppIcon';

export class NavLink extends Component {
  render() {
    return (
      <Link
        aria-disabled={this.props.disabled}
        className={`flex items-center py-2 text-gray-800 text-base capitalize font-bold
           ${
             this.props.disabled
               ? 'pointer-events-none opacity-50'
               : 'hover:text-blue-600'
           }`}
        to={this.props.to}
      >
        {this.props.icon && (
          <AppIcon
            file="hero-icons"
            id={this.props.icon}
            className="w-6 h-6 mr-2"
          />
        )}
        {this.props.name}
      </Link>
    );
  }
}

export class NavMenu extends Component {
  constructor(props) {
    super(props);
    const menuType = {
      anchor: AppAnchor,
      button: AppButton,
      file: AppFile,
    };
    this.MenuComponent = menuType[props.component];
  }

  render() {
    return (
      <li key={`${this.props.name}`}>
        <this.MenuComponent
          className={`flex items-center py-2 cursor-pointer
             text-gray-800 text-base capitalize font-bold
             ${
               this.props.disabled
                 ? 'opacity-50 cursor-not-allowed'
                 : 'hover:text-blue-600'
             }`}
          {...this.props}
        >
          {this.props.icon && (
            <AppIcon
              file="hero-icons"
              id={this.props.icon}
              className="w-6 h-6 mr-2"
            />
          )}
          {this.props.name}
        </this.MenuComponent>
      </li>
    );
  }
}

export class NavGroup extends Component {
  render() {
    return (
      <div className={`flex flex-col items-center ${this.props.className}`}>
        <Link
          className="lg:min-w-full font-bold text-lg uppercase text-gray-600"
          to={this.props.to}
        >
          {this.props.title}
        </Link>

        <ul
          className="flex flex-col items-center justify-center list-none
                     lg:min-w-full lg:items-start lg:ml-4"
        >
          {this.props.children}
        </ul>
      </div>
    );
  }
}
