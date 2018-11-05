import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Actions from '../../../redux/actions/index';

class AuthContainer extends React.Component {
  componentWillMount() {
    this.checkExistingAuth();
  }
  componentDidUpdate() {
    const { authorized, loading, error } = this.props.users.auth;
    const { history } = this.props;
    if (authorized) {
      return null;
    } else if (!authorized && !loading && error) {
      history.push('/login');
    }
    return null;
  }

  checkExistingAuth() {
    const { asyncAction, history } = this.props;
    // const {user}          = this.props.users.auth
    const token = localStorage.getItem('pi');
    if (token) {
      asyncAction('token');
    } else {
      history.push('/login');
    }
  }

  render() {
    const { children } = this.props;
    const { authorized } = this.props.users.auth;
    if (!authorized) return null;
    return children;
  }
}

AuthContainer.propTypes = {
  users: PropTypes.shape({
    auth: PropTypes.shape({
      authorized: PropTypes.bool,
      loading: PropTypes.bool,
      error: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  asyncAction: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default withRouter(connect(
  state => state,
  dispatch => ({ asyncAction: bindActionCreators(Actions.asyncAction, dispatch) }),
  null,
  { pure: false },
)(AuthContainer));
