import React from 'react';
import PropTypes from 'prop-types';

const MemberMemberDetails = ({ member }) => {
  if (!member) return null;

  return (
    <div className="text-center">
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${member.chapter.image})`,
          height: '20vh',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <h2>{member.name}</h2>
        {
          member.tagline &&
          <h4>{member.tagline}</h4>
        }
      </div>
      <img src={member.image} alt="member" />
      <div>{member.chapter.name} Chapter</div>
    </div>
  );
};

MemberMemberDetails.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
    chapter: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

MemberMemberDetails.defaultProps = {
  member: null,
};

export default MemberMemberDetails;
