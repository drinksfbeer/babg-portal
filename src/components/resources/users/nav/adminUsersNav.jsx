import React from 'react';
// import PropTypes from 'prop-types';

// filter,
// forward,
// changeUserDirectoryState,

const AdminUsersNav = () => (
  <nav
    className="grid-x grid-padding-x grid-padding-y app-item text-left"
    style={{
      backgroundColor: '#333',
      color: 'white',
      fontWeight: '800',
    }}
  >
    <div
      className="cell large-3 medium-4"
    >
      Email
    </div>
    <div
      className="cell large-4 medium-4"
    >
      Permissions
    </div>
    <div
      className="cell large-2 medium-2"
    >
      Status
    </div>
    <div
      className="cell large-2 medium-2"
    >
      Remove
    </div>
  </nav>
);

AdminUsersNav.propTypes = {
  // filter: PropTypes.string.isRequired,
  // forward: PropTypes.bool.isRequired,
  // changeUserDirectoryState: PropTypes.func.isRequired,
};

export default AdminUsersNav;
