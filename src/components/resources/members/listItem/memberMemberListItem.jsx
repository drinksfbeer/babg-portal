import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const MemberMemberListItem = ({ member }) => (
  <div className="text-center">
    <img
      src={member.image}
      alt="brewery-logo"
    />
    <strong>{member.name}</strong>
    <div>
      {member.locations.map(location => (
        <div key={location._id}>
          <div
            style={{
              fontSize: '80%',
              fontStyle: 'italic',
              color: 'grey',
            }}
          >
            {location.name}
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        paddingTop: '10px',
        color: 'rgba(0,0,0,0.4)',
        fontSize: '70%',
      }}
    >
      added {moment(member.created).format('ll')}
    </div>
  </div>
);

MemberMemberListItem.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })),
  }).isRequired,
};
export default MemberMemberListItem;
