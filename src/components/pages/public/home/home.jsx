import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from '../../../../redux/actions/index';

class Home extends React.Component {
  componentDidMount() {
    this.props.asyncAction('token');
  }

  componentDidUpdate() {
    const { authorized, loading } = this.props.auth;
    const { history } = this.props;

    if (authorized) {
      history.push('/dashboard');
    } else if (!loading) {
      history.push('/login');
    }
  }

  render() {
    return (
      <div className="grid-x align-center">
        <div className="cell large-6 medium-8 small-10" />
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.shape({
    authorized: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  asyncAction: PropTypes.func.isRequired,
};

export default connect(
  state => state.users,
  dispatch => ({ asyncAction: bindActionCreators(Actions.asyncAction, dispatch) }),
  null,
  { pure: false },
)(Home);
