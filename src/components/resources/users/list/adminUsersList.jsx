import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AdminUserListItem from '../listItem/adminUserListItem';

const AdminUsersList = ({ users }) => (
  <div>
    {users.map(user => (
      <Link
        to={`/user/${user._id}`}
        key={user._id}
      >
        <AdminUserListItem
          user={user}
        />
      </Link>
    ))}
  </div>
);

AdminUsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({})),
};
AdminUsersList.defaultProps = {
  users: [],
};

export default AdminUsersList;
