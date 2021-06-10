import React from 'react';

import AppModal from '@components/AppModal';
import GroupForm from '@/modules/data/components/GroupForm';
import TableForm from '@/modules/data/components/TableForm';
import InfoForm from '@/modules/data/components/InfoForm';
import PlotsForm from '@/modules/plotly/components/PlotsForm';
import TopBar from './TopBar';
import Navigation from './Navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class AppLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      showNav: false,
      showGroupModal: false,
      showPlotsModal: false,
      showTableModal: false,
      showInfoModal: false,
    };
  }

  /* NAVIGATION */

  onTopBarToggle = () =>
    this.setState((state) => ({ showNav: !state.showNav }));
  onNavigationClose = () => this.setState({ showNav: false });

  /* MODALS */

  onShowGroupModal = () => this.setState({ showGroupModal: true });
  onShowPlotsModal = () => this.setState({ showPlotsModal: true });
  onShowTableModal = () => this.setState({ showTableModal: true });
  onShowInfoModal = () => this.setState({ showInfoModal: true });

  onGroupFormModalHide = () => this.setState({ showGroupModal: false });
  onGroupFormCancel = () => this.setState({ showGroupModal: false });
  onGroupFormSave = () => this.setState({ showGroupModal: false });

  onPlotFormModalHide = () => this.setState({ showPlotsModal: false });
  onPlotFormCancel = () => this.setState({ showPlotsModal: false });

  onTableFormModalHide = () => this.setState({ showTableModal: false });
  onTableFormCancel = () => this.setState({ showTableModal: false });
  onTableFormSave = () => this.setState({ showTableModal: false });

  onInfoFormModalHide = () => this.setState({ showInfoModal: false });
  onInfoFormCancel = () => this.setState({ showInfoModal: false });
  onInfoFormSave = () => this.setState({ showInfoModal: false });

  onErrorToast = (error) =>
    toast.error(error, {
      position: 'top-right',
      autoClose: 10000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  toastClassName = () => {
    const contextClass = {
      success: 'bg-green-700',
      error: 'bg-red-700',
      info: 'bg-blue-700',
      warning: 'bg-orange-400',
      default: 'bg-indigo-600',
      dark: 'bg-white-600 font-gray-300',
    };

    return ({ type }) =>
      contextClass[type || 'default'] +
      ' flex m-2 p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer';
  };

  render() {
    return (
      <>
        {/* Error Toasts */}
        <ToastContainer
          toastClassName={this.toastClassName()}
          bodyClassName={() => 'text-sm font-white font-med block p-3'}
        />
        {/* NAVIGATION */}
        <div
          className="relative z-20 py-4 px-3 lg:w-68
                     shadow-xl bg-white lg:overflow-y-auto
                     lg:fixed lg:block lg:inset-y-0 lg:left-0"
        >
          {/* NAVIGATION HEADER */}
          <TopBar
            onToggle={this.onTopBarToggle}
            show={this.state.showNav}
            brand="Gene Expression Plots"
          />

          {/* COLLAPSIBLE NAVIGATION */}
          <Navigation
            show={this.state.showNav}
            showGroupModal={this.onShowGroupModal}
            showPlotsModal={this.onShowPlotsModal}
            showTableModal={this.onShowTableModal}
            showInfoModal={this.onShowInfoModal}
            onClose={this.onNavigationClose}
            onError={this.onErrorToast}
          />
        </div>

        {/* PAGE CONTENT */}
        <div className="relative lg:ml-68 flex flex-col min-h-screen bg-gray-300">
          {/* ROUTES */}
          {this.props.children}

          {/* DATA GROUP FORM */}
          {this.state.showGroupModal && (
            <AppModal
              title="Add Replicate Tables"
              showModal={this.state.showGroupModal}
              hideModal={this.onGroupFormModalHide}
            >
              <GroupForm
                onSave={this.onGroupFormSave}
                onCancel={this.onGroupFormCancel}
                onError={this.onErrorToast}
              />
            </AppModal>
          )}

          {/* DATA TABLE FORM */}
          {this.state.showTableModal && (
            <AppModal
              title="Add Expression Table"
              showModal={this.state.showTableModal}
              hideModal={this.onTableFormModalHide}
            >
              <TableForm
                onSave={this.onTableFormSave}
                onCancel={this.onTableFormCancel}
                onError={this.onErrorToast}
              />
            </AppModal>
          )}

          {/* INFO TABLE FORM */}
          {this.state.showInfoModal && (
            <AppModal
              title="Add Info Table"
              showModal={this.state.showInfoModal}
              hideModal={this.onInfoFormModalHide}
            >
              <InfoForm
                onSave={this.onInfoFormSave}
                onCancel={this.onInfoFormCancel}
                onError={this.onErrorToast}
              />
            </AppModal>
          )}

          {/* PLOTS FORM */}
          {this.state.showPlotsModal ? (
            <AppModal
              title="Add Plot"
              showModal={this.state.showPlotsModal}
              hideModal={this.onPlotFormModalHide}
            >
              <PlotsForm onCancel={this.onPlotFormCancel} />
            </AppModal>
          ) : null}
        </div>
      </>
    );
  }
}
