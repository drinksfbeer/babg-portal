import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Actions from '../../../redux/actions/';

const DeleteConfirmation = ({
  message,
  resource,
  record,
  crudAction,
  onSubmit,
  response,
  delicate,
}) => {
  const submit = onSubmit || (() => {
    if (delicate) {
      if (window.prompt('Please type DELETE to confirm deleting') === 'DELETE') { // eslint-disable-line
        crudAction({
          type: 'delete',
          resource,
        }, { _id: record._id }, (err, data) => {
          response && response(err, data); // eslint-disable-line
        });
      } else {
        window.confirm('did not confirm correctly'); // eslint-disable-line
      }
    } else {
      crudAction({
        type: 'delete',
        resource,
      }, { _id: record._id }, (err, data) => {
        response && response(err, data); // eslint-disable-line
      });
    }
  });

  return (
    <div
      className="grid-x grid-padding-x grid-padding-y align-center align-middle text-center"
      style={{ height: '100%' }}
    >
      <div className="cell">
        <h4>{message}</h4>
      </div>
      <div className="cell">
        <div className="button alert" onClick={submit}>
          Submit
        </div>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
  message: PropTypes.string.isRequired,
  resource: PropTypes.string,
  record: PropTypes.shape({}),
  crudAction: PropTypes.func,
  onSubmit: PropTypes.func,
  response: PropTypes.func,
  delicate: PropTypes.bool,
};

DeleteConfirmation.defaultProps = {
  resource: '',
  record: {},
  crudAction: () => {},
  onSubmit: null,
  response: null,
  delicate: false,
};

export default connect(
  null,
  dispatch => ({
    crudAction: bindActionCreators(Actions.crudAction, dispatch),
  }),
)(DeleteConfirmation);
