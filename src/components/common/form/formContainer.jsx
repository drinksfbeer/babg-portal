import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import notifications from 'react-notification-system-redux';

import Actions from '../../../redux/actions/index';
import ReduxFormContainer from './redux/reduxFormContainer';

// User FormContainer and inputs to create forms,
// All it needs is
// an optional pre-existing record ( to edit )
// nest the input components inside FormContainer through redux Field Components, makes children
// submit is a required callback to deal with the packaged form data

const FormContainer = ({
  form,
  formState,
  record,
  submit,
  // values,
  renderProps,
  dispatch,
  asyncAction,
  crudAction,
  history,
  success,
  error,
}) => {
  const values = formState[form] && formState[form].values;

  return (
    <ReduxFormContainer
      form={form}
      initialValues={record}
      onSubmit={(results) => {
        const actions = {
          clearForm: () => dispatch(reset(form)),
          crudAction,
          asyncAction,
          history,
        };
        const notifs = {
          success: msg => success({ title: msg }),
          error: msg => error({ title: msg }),
        };
        submit(results, actions, notifs);
      }}
    >
      {renderProps(values || {})}
    </ReduxFormContainer>
  );
};

FormContainer.defaultProps = {
  form: 'container',
  formState: {},
  record: {},
  // values: {},
  renderProps: () => console.warn('Render Props Missing'), // eslint-disable-line
};

FormContainer.propTypes = {
  // children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  form: PropTypes.string,
  formState: PropTypes.shape({}),
  renderProps: PropTypes.func,
  record: PropTypes.shape({}),
  submit: PropTypes.func.isRequired,
  // values: PropTypes.shape({}),
  dispatch: PropTypes.func.isRequired,
  asyncAction: PropTypes.func.isRequired,
  crudAction: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired,
  error: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  state => ({
    // values: state.form.container && state.form.container.values,
    formState: state.form,
  }),
  dispatch => ({
    dispatch,
    asyncAction: bindActionCreators(Actions.asyncAction, dispatch),
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
    success: bindActionCreators(notifications.success, dispatch),
    error: bindActionCreators(notifications.error, dispatch),
  }),
  null,
  { pure: false },
)(withRouter(FormContainer));
