import React from 'react';

import AppButton from './AppButton';
import AppIcon from './AppIcon';
import AppOverlay from './AppOverlay';

export default class AppModal extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      this.props.showModal && (
        <AppOverlay
          className={`shadow-lg rounded-lg bg-white ${
            this.props.className ?? ''
          }`}
          overlayClass="bg-black"
          onClick={this.props.hideModal}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 rounded-t text-gray-800">
            <h2 className="uppercase w-full text-center text-base sm:text-xl md:text-2xl font-semibold">
              {this.props.title}
            </h2>

            <AppButton onClick={this.props.hideModal} className="group">
              <AppIcon
                file="hero-icons"
                id="close"
                className="w-6 h-6 group-hover:text-pink-700"
              />
            </AppButton>
          </div>

          {/* BODY */}
          {this.props.children}
        </AppOverlay>
      )
    );
  }
}
