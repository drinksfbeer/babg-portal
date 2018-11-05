import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import RegisterForm from '../../../common/auth/register';

const RegisterContainer = ({ authorized }) => {
  if (authorized) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="grid-x grid-padding-x grid-padding-y align-center">
      <div
        className="app-item cell large-6 medium-8 small-10"
        style={{
          marginTop: '20vh',
        }}
      >
        <RegisterForm />
      </div>
    </div>
  );
};

RegisterContainer.propTypes = {
  authorized: PropTypes.bool,
};

RegisterContainer.defaultProps = {
  authorized: false,
};

export default connect(
  null,
  null,
)(RegisterContainer);
