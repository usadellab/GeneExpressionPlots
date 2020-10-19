import React from 'react';
import { withRouter } from 'react-router';

import GroupView  from '@/modules/data/pages/GroupView';
import PlotsForm  from '@/modules/plotly/pages/PlotsForm';
import AppModal   from '@components/AppModal';
import TopBar     from './TopBar';
import Navigation from './Navigation';


class AppLayout extends React.Component {

  constructor () {
    super();
    this.state = {
      showNav: false,
      showGroupModal: false,
      showPlotsModal: false,
    };
  }

  changeRoute = (route) => {
    this.props.history.push(`/${route}`);
  }

  showGroupModal = () => {
    this.setState({ showGroupModal: true });
    //change route
    this.changeRoute('data');
  }
  showPlotsModal = () => {
    this.setState({ showPlotsModal: true });
    //change route
    this.changeRoute('plots');
  }

  hideGroupModal = () => this.setState({ showGroupModal: false })
  hidePlotsModal = () => this.setState({ showPlotsModal: false })

  toggleNav = () => this.setState(state => ({ showNav: !state.showNav }))
  hideNav = () => this.setState({ showNav: false })

  render () {
    return (
      <>
        <div
          className="relative z-20 py-4 px-6 md:w-64
                     shadow-xl bg-white
                     md:fixed md:block md:inset-y-0 md:left-0"
        >

          {/* NAVIGATION HEADER */}
          <TopBar
            onToggle={ this.toggleNav }
            show={ this.state.showNav }
            brand="Gene Expression Plots"
          />

          {/* COLLAPSIBLE NAVIGATION */}
          <Navigation
            show={ this.state.showNav }
            showGroupModal={ this.showGroupModal }
            showPlotsModal={ this.showPlotsModal }
            onClick={ this.hideNav }
            changeRoute = { this.changeRoute }
          />

        </div>

        <div className="relative md:ml-64">

          { this.props.children }
          {
            this.state.showGroupModal
              ?
              <AppModal
                title="Add Tables"
                showModal={ this.state.showGroupModal }
                hideModal={ this.hideGroupModal }
              >
                <GroupView
                  onSave={ this.hideGroupModal }
                  onCancel={ this.hideGroupModal }
                />
              </AppModal>
              :
              null
          }
          {
            this.state.showPlotsModal
              ?
              <AppModal
                title="Add Plot"
                showModal={ this.state.showPlotsModal }
                hideModal={ this.hidePlotsModal }
              >
                <PlotsForm
                  onCancel={ this.hidePlotsModal }
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

export default withRouter(AppLayout);