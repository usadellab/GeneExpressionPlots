import React from 'react';

import AppModal   from '@components/AppModal2';
import GroupForm  from '@/modules/data/components/GroupForm';
import TableForm  from '@/modules/data/components/TableForm';
import PlotsForm  from '@/modules/plotly/components/PlotsForm';
import TopBar     from './TopBar';
import Navigation from './Navigation';


export default class AppLayout extends React.Component {

  constructor () {
    super();
    this.state = {
      showNav: false,
      showGroupModal: false,
      showPlotsModal: false,
      showTableModal: false,
    };
  }

  /* NAVIGATION */

  onTopBarToggle = () => this.setState(state => ({ showNav: !state.showNav }))
  onNavigationClick = () => this.setState({ showNav: false })

  onShowGroupModal = () => this.setState({ showGroupModal: true });
  onShowPlotsModal = () => this.setState({ showPlotsModal: true });
  onShowTableModal = () => this.setState({ showTableModal: true })

  /* MODALS */

  onGroupFormModalHide = () => this.setState({ showGroupModal: false })
  onGroupFormCancel = () => this.setState({ showGroupModal: false })
  onGroupFormSave = () => this.setState({ showGroupModal: false })

  onPlotFormModalHide = () => this.setState({ showPlotsModal: false })
  onPlotFormCancel = () => this.setState({ showPlotsModal: false })

  onTableFormModalHide = () => this.setState({ showTableModal: false })
  onTableFormCancel = () => this.setState({ showTableModal: false })
  onTableFormSave = () => this.setState({ showTableModal: false })


  render () {
    return (
      <>
        {/* NAVIGATION */}
        <div
          className="relative z-20 py-4 px-3 md:w-64
                     shadow-xl bg-white
                     md:fixed md:block md:inset-y-0 md:left-0"
        >

          {/* NAVIGATION HEADER */}
          <TopBar
            onToggle={ this.onTopBarToggle }
            show={ this.state.showNav }
            brand="Gene Expression Plots"
          />

          {/* COLLAPSIBLE NAVIGATION */}
          <Navigation
            show={ this.state.showNav }
            showGroupModal={ this.onShowGroupModal }
            showPlotsModal={ this.onShowPlotsModal }
            showTableModal={ this.onShowTableModal }
            onClick={ this.onNavigationClick }
          />

        </div>

        {/* PAGE CONTENT */}
        <div className="relative md:ml-64 flex flex-col min-h-screen bg-gray-300">

          {/* ROUTES */}
          { this.props.children }

          {/* DATA GROUP FORM */}
          {
            this.state.showGroupModal &&
            <AppModal
              title="Add Replicate Tables"
              showModal={ this.state.showGroupModal }
              hideModal={ this.onGroupFormModalHide }
            >
              <GroupForm
                onSave={ this.onGroupFormSave }
                onCancel={ this.onGroupFormCancel }
              />
            </AppModal>
          }

          {/* DATA TABLE FORM */}
          {
            this.state.showTableModal &&
            <AppModal
              title="Add Expression Table"
              showModal={ this.state.showTableModal }
              hideModal={ this.onTableFormModalHide }
            >
              <TableForm
                onSave={ this.onTableFormSave }
                onCancel={ this.onTableFormCancel }
              />
            </AppModal>
          }

          {/* PLOTS FORM */}
          {
            this.state.showPlotsModal
              ?
              <AppModal
                title="Add Plot"
                showModal={ this.state.showPlotsModal }
                hideModal={ this.onPlotFormModalHide }
              >
                <PlotsForm
                  onCancel={ this.onPlotFormCancel }
                />
              </AppModal>
              :
              null
          }

        </div>
      </>
    );
  }
}
