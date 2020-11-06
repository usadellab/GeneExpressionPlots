import React from 'react';

import AppButton  from './AppButton';
import AppIcon    from './AppIcon';
import AppOverlay from './AppOverlay';

export default class AppModal extends React.Component {

  constructor () {
    super();
  }

  hideModal = () => this.setState({ showModal: false })

  render () {

    return (
      this.props.showModal &&
      <AppOverlay
        className="shadow-lg rounded-lg bg-white"
        overlayClass="bg-black"
        onClick={ this.props.hideModal }
      >

        {/* HEADER */}
        <div
          className="flex items-center justify-between px-6 pb-2 mt-5 rounded-t text-gray-800"
        >

          <h2 className="uppercase w-full text-center text-3xl font-semibold">
            { this.props.title }
          </h2>

          <AppButton onClick={ this.props.hideModal } className="group" >
            <AppIcon file="hero-icons" id="close" className="w-6 h-6 group-hover:text-pink-700" />
          </AppButton>
        </div>

        {/* BODY */}
        { this.props.children }

      </AppOverlay>
    );
  }
}