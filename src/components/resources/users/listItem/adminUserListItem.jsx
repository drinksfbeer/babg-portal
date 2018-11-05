import React from 'react';
import PropTypes from 'prop-types';

const AdminUserListItem = ({ user }) => {
  const permissionsMarkup = user.permissions.map((item, index) => (
    <span
      key={item}
    >
      {item}
      {user.permissions[index + 1] ? ', ' : ''}
    </span>
  ));

  return (
    <div className="grid-x grid-padding-x grid-padding-y app-item">
      <strong className="cell large-3 medium 3">{user.email}</strong>
      <div className="cell large-4 medium-4">
        {permissionsMarkup}
      </div>
      <div className="cell large-2 medium-2">
        {
          user.hasBeenInvited &&
          !user.hasRegistered &&
            (
              <div>Sent Invite & Awaiting Registration</div>
            )
        }

        {
          user.hasBeenInvited &&
          user.hasRegistered &&
            (
              <div>Registered</div>
            )
        }

        {
          !user.hasBeenInvited &&
            (
              <div>Not Invited</div>
            )
        }
      </div>
      <div className="cell large-2 medium-2">
        <button className="button tiny alert">
          Delete
        </button>
      </div>
    </div>
  );
};

AdminUserListItem.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    hasRegistered: PropTypes.bool.isRequired,
    hasBeenInvited: PropTypes.bool,
    permissions: PropTypes.array.isRequired,
  }).isRequired,
};

export default AdminUserListItem;
