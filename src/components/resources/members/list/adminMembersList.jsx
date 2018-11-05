import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AdminMemberListItem from '../listItem/adminMemberListItem';

const AdminMembersList = ({ members }) => (
  <div className="grid-container fluid">
    {members.map(member => (
      <Link
        to={`/member/${member._id}`}
        // className="grid-x grid-padding-x grid-padding-y"
        key={member._id}
      >
        <AdminMemberListItem
          member={member}
        />
      </Link>
    ))}
  </div>
);

AdminMembersList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({})),
};
AdminMembersList.defaultProps = {
  members: [],
};

export default AdminMembersList;
