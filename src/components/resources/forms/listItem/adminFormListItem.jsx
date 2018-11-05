import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2';

const AdminFormListItem = ({ form }) => (
  <div
    className="grid-x grid-padding-y grid-padding-x app-item"
  >
    <div className="cell large-7 medium-7">
      <Link
        to={`/form/${form.uuid}`}
        // className="grid-x grid-padding-x grid-padding-y"
        key={form._id}
      >
        {form.name}
      </Link>
    </div>
    <div className="cell large-3 medium-3">
      <CopyToClipboard
        text={`${window.location.origin}/forms/${form.uuid}`}
        onCopy={() => swal({
          type: 'success',
          text: 'Successfully copied to clipboard',
        })}
      >
        <div
          style={{
            color: 'grey',
            cursor: 'pointer',
            fontStyle: 'italic',
          }}
        >
          Copy Form URL to clipboard
        </div>
      </CopyToClipboard>
    </div>
    <div className="cell large-2 medium-2">{moment(form.created).format('ll')}</div>
  </div>
);

AdminFormListItem.propTypes = {
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AdminFormListItem;
