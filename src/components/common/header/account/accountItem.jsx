import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AccountItem = ({
  to,
  member,
  active,
  setInactive,
}) => {
  if (!member || !active) {
    return null;
  }
  return (
    <div className="profile">
      <Link
        to={to}
        onClick={() => {
          if (setInactive) {
            setInactive();
          }
        }}
        className="account-item"
      >
        <div className="member-logo-wrapper">
          <img
            alt="member logo"
            src={member.image}
            className="member-logo"
          />
        </div>
        <div className="member-name">
          {member.name}
        </div>
      </Link>
    </div>
  );
};

AccountItem.propTypes = {
  to: PropTypes.string,
  member: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }),
  setInactive: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

AccountItem.defaultProps = {
  to: '/settings',
  member: null,
  active: false,
};

export default AccountItem;
