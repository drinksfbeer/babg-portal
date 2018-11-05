import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const AdminMemberListItem = ({ member }) => (
  <div
    className="grid-x grid-padding-y grid-padding-x app-item"
  >
    <div className="cell large-3 medium-3">
      <img
        src={member.image}
        alt="member-logo"
        style={{
          borderRadius: '100%',
          width: '35px',
          marginRight: '5px',
        }}
      />
      {member.name}
    </div>
    <div className="cell large-2 medium-2">{member.status}</div>
    <div className="cell large-2 medium-2">
      {member.untappdId ? (
        <img
          src="https://i.imgur.com/FDHldhV.png"
          alt="untappd"
          width="22px"
        />
      ) : (
        'Needs'
      )}
    </div>
    <div className="cell large-3 medium-3">
      {member.locations.map(location => (
        <div
          key={location._id}
          style={{
            color: 'grey',
            fontStyle: 'italic',
          }}
        >
          {location.name}
        </div>
      ))}
    </div>
    <div className="cell large-2 medium-2">{moment(member.created).format('ll')}</div>
  </div>
);

AdminMemberListItem.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

export default AdminMemberListItem;
