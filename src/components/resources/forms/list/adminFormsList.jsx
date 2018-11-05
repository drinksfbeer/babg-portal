import React from 'react';
import PropTypes from 'prop-types';

import AdminFormListItem from '../listItem/adminFormListItem';

const AdminFormsList = ({ forms }) => (
  <div>
    {forms.map(form => (
      <AdminFormListItem
        form={form}
        key={form._id}
      />
    ))}
  </div>
);

AdminFormsList.propTypes = {
  forms: PropTypes.arrayOf(PropTypes.shape({})),
};
AdminFormsList.defaultProps = {
  forms: [],
};

export default AdminFormsList;
