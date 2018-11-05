import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Actions from '../../../../redux/actions/index';
import Forgot from '../../../common/auth/forgot';
import Loading from '../../../common/loading/loading';
import LoginForm from '../../../common/auth/loginForm';
import RegisterForm from './sfbwRegister';

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
      authorized,
      pages,
      loading,
    } = this.props;

    if (authorized) return <Redirect to="/sfbw/events" />;
    if (loading || pages.length !== 1) return <Loading />;

    return (
      <div className="login-container">
        <div
          className="image-section"
          style={{
            backgroundImage: 'url(https://cdn.filestackcontent.com/Y6RXzYrDTMyVPtuAsFhz)',
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
          pathname === '/login/sfbw' &&
          <div className="side-form login">
            <h3 className="secondary-title">SFBW</h3>
            <h2 className="main-title">Log In</h2>
            <LoginForm
              asyncAction={asyncAction}
            />
            <div className="options">
              <h6>Don't have an account? <Link to="/register/sfbw">Register Here</Link></h6>
            </div>
          </div>
        }
        {
          pathname === '/register/sfbw' &&
          <div className="side-form register">
            <h3 className="secondary-title">SFBW Event Submission</h3>
            <h2 className="main-title">Sign Up</h2>
            <RegisterForm
              asyncAction={asyncAction}
            />
          </div>
        }
        {
          pathname === '/forgot' &&
          <div className="side-form login">
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
  authorized: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
};

LoginContainer.defaultProps = {
  history: {},
  location: {
    pathname: '',
  },
  authorized: false,
  pages: [],
  loading: false,
};

export default connect(
  state => ({
    authorized: state.users.auth.authorized,
    pages: state.pages.list._list,
    loading: state.pages.list.loading,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(Actions.asyncAction, dispatch),
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
)(LoginContainer);
