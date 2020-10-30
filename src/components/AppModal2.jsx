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
          className="flex items-start justify-between px-6 mt-5 rounded-t text-gray-800"
        >

          <h2 className="uppercase text-3xl font-semibold">
            { this.props.title }
          </h2>

          <AppButton onClick={ this.props.hideModal } >
            <AppIcon file="hero-icons" id="close" className="w-6 h-6" />
          </AppButton>
        </div>

        {/* BODY */}
        { this.props.children }

      </AppOverlay>
    );
  }
}