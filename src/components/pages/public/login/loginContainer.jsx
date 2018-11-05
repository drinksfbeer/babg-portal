import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import Loading from '../../../common/loading/loading';
import Actions from '../../../../redux/actions/index';
import LoginForm from '../../../common/auth/loginForm';
import Forgot from '../../../common/auth/forgot';

class LoginContainer extends React.Component {
  componentDidMount() {
    const { loading, crudAction } = this.props;

    if (!loading) {
      crudAction({
        resource: 'pages',
        query: 'name=login&special=true',
      });
    }
  }

  render() {
    const {
      history,
      location: {
        pathname,
      },
      asyncAction,
      user,
      authorized,
      pages,
      loading,
    } = this.props;

    if (authorized) {
      if (user.role === 'agent') {
        return <Redirect to="/sfbw/events" />;
      }
      return <Redirect to="/dashboard" />;
    }
    if (loading || pages.length !== 1) return <Loading />;

    const { loginImage } = pages[0];

    return (
      <div className="login-container">
        <div
          className="image-section"
          style={{
            backgroundImage: `url('${loginImage}')`,
          }}
        >
          <div className="content">
            <h1 className="title">
              <span className="main">BAY AREA</span>
              <span className="secondary">BREWERS GUILD</span>
            </h1>
          </div>
        </div>
        {
          pathname === '/login' &&
          <div className="side-form">
            <h2 className="main-title">LOG IN</h2>
            <LoginForm
              asyncAction={asyncAction}
            />
          </div>
        }
        {
          pathname === '/login/sfbw' &&
          <div className="side-form">
            <h2 className="main-title">LOG IN</h2>
            <LoginForm
              asyncAction={asyncAction}
            />
          </div>
        }
        {
          pathname === '/forgot' &&
          <div className="side-form">
            <h2>FORGOT PASSWORD</h2>
            <Forgot history={history} />
          </div>
        }
      </div>
    );
  }
}

LoginContainer.propTypes = {
  history: PropTypes.shape({}),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  asyncAction: PropTypes.func.isRequired,
  crudAction: PropTypes.func.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  authorized: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
};

LoginContainer.defaultProps = {
  history: {},
  location: {
    pathname: '',
  },
  user: {
    role: '',
  },
  authorized: false,
  pages: [],
  loading: false,
};

export default connect(
  state => ({
    user: state.users.auth.user,
    authorized: state.users.auth.authorized,
    pages: state.pages.list._list,
    loading: state.pages.list.loading,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(Actions.asyncAction, dispatch),
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
)(LoginContainer);
