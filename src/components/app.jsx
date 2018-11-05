import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Notifications from 'react-notification-system-redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

import Header from './common/header/header';
import AuthContainer from './common/auth/authContainer';
import ServeContainer from './common/auth/serveContainer';

import SNACK_STYLE from '../styling/snackStyle';
import AdminRoutes from './pages/admin/adminRoutes';
import MemberRoutes from './pages/member/memberRoutes';
import AgentRoutes from './pages/agent/agentRoutes';
import PublicRoutes from './pages/public/publicRoutes';

library.add(fab);
library.add(far);
library.add(fas);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };

    this.toggleActive = this.toggleActive.bind(this);
  }

  toggleActive(newState) {
    this.setState(newState);
  }

  render() {
    const { snacks, user } = this.props;
    const { active } = this.state;
    // const isLogin = window.location.pathname === '/login';
    // const isRegister = window.location.pathname === '/register';
    // const isHome = window.location.pathname === '/';
    const inactiveRoutes = ['/', '/login', '/register', '/forgot', '/login/sfbw', '/register/sfbw'];
    const isRedeemInvite = window.location.pathname.includes('/redeem-invite');

    // const inactive = isLogin || isRegister || isHome || isRedeemInvite;
    const inactive = inactiveRoutes.includes(window.location.pathname) || isRedeemInvite;
    const role = user && user.role;
    const { pathname } = window.location;
    const formPath = pathname.split('/')[1] === 'forms'; // first index is blank, so 1 is used

    return (
      <div
        className={classNames({
          'site-canvas': true,
          'nav-open': !formPath && active,
          'nav-closed': formPath || !active,
          full: inactive || formPath,
        })}
      >
        <Notifications
          notifications={snacks}
          style={SNACK_STYLE}
        />
        {!inactive &&
          <Switch>
            <Route
              path="/chapters/:slug"
              render={props => (
                <Header
                  toggleActive={this.toggleActive}
                  {...props}
                />
              )}
            />
            <Route path="/forms/:id" render={() => null} />
            <Route
              render={props => (
                <Header
                  toggleActive={this.toggleActive}
                  {...props}
                />
              )}
            />
          </Switch>
        }
        <div
          className={classNames({
            'body-container': true,
            full: !!formPath,
          })}
        >
          <Switch>
            {PublicRoutes}
            <Route
              render={() => (
                <AuthContainer>
                  <ServeContainer>
                    {(() => {
                      switch (role) {
                        case 'master': return AdminRoutes;
                        case 'chapter': return AdminRoutes;
                        case 'member': return MemberRoutes;
                        case 'agent': return AgentRoutes;
                        default: return null;
                      }
                    })()}
                  </ServeContainer>
                </AuthContainer>
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  snacks: PropTypes.arrayOf(PropTypes.shape({})),
  user: PropTypes.shape({}),
};

App.defaultProps = {
  snacks: [],
  user: null,
};

export default connect(
  state => ({
    snacks: state.snacks,
    user: state.users.auth.user,
  }),
  null,
  null,
  { pure: false },
)(App);
