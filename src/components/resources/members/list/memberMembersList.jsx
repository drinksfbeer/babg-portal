import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import MemberMemberListItem from '../listItem/memberMemberListItem';

const MemberMembersList = ({ members }) => (
  <div className="grid-x grid-padding-x grid-padding-y grid-margin-x grid-margin-y align-center">
    {members.map(member => (
      <Link
        className="cell large-3 medium-4 small-8 app-item"
        to={`/member/${member._id}`}
        key={member._id}
      >
        <MemberMemberListItem
          member={member}
        />
      </Link>
    ))}
  </div>
);

MemberMembersList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({})),
};
MemberMembersList.defaultProps = {
  members: [],
};

export default MemberMembersList;
