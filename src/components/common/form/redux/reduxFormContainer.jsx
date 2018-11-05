import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
// import uuid from 'uuid/v1';

const RawForm = ({ children, handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>;

RawForm.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const ReduxFormContainer = reduxForm({
  // form: 'container', // passed as a prop in FormContainer, default value being 'container'
  enableReinitialize: true,
})(RawForm);

export default ReduxFormContainer;
