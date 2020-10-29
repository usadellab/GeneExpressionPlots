import React from 'react';

import AppButton from '@components/AppButton';
import AppIcon   from '@components/AppIcon';

export default class AppModal extends React.Component {

  constructor () {
    super();
  }

  hideModal = () => this.setState({ showModal: false })

  render () {

    return (
      this.props.showModal ? (
        <>
          <div
            className="fixed inset-0 z-50 mx-3 md:mx-6 lg:m-0
                       flex justify-center items-center
                       outline-none focus:outline-none"
          >

            {/* CONTENT */}
            <div
              className="relative flex flex-col w-full max-w-3xl
                         shadow-lg border-0 rounded-lg focus:outline-none bg-white "
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
              <div className="relative px-6 flex-auto">
                <div className="my-4 text-gray-600 text-lg leading-relaxed">
                  { this.props.children }
                </div>
              </div>

            </div>

          </div>

          {/* OVERLAY */}
          <div
            className="opacity-25 fixed inset-0 z-40 bg-black"
            onClick={ this.props.hideModal }
          />

        </>
      ) : null
    );
  }
}