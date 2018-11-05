import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { bindActionCreators } from 'redux';

// import Actions from '../../../../redux/actions/index';
import Loading from '../../../common/loading/loading';

const DashboardContainer = ({
  member,
  memberLoading,
}) => {
  if (memberLoading) return <Loading />;
  if (!member) return null;
  const navBoxes = [{
    title: 'Activity',
    icon: 'explore',
    to: '/guild',
  }, {
    title: 'Events',
    icon: 'calendar_today',
    to: '/events',
  }, {
    title: 'Locations',
    icon: 'edit_location',
    to: '/locations',
  }, {
    title: 'Accounts',
    icon: 'account_circle',
    to: '/accounts',
  }, {
    title: 'Settings',
    icon: 'settings',
    to: '/settings',
  }];

  return (
    <div className="grid-container">
      <div
        className="align-center grid-x"
      >
        <div className="cell large-8 medium-10 text-center">
          <h2
            style={{
              margin: '40px 0px',
            }}
          >
            Welcome {member.name}
          </h2>
          <div className="grid-x  grid-padding-y grid-margin-x grid-margin-y">
            {navBoxes.map(item => (
              <NavBox
                key={item.to}
                {...item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardContainer.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  memberLoading: PropTypes.bool,
};
DashboardContainer.defaultProps = {
  member: null,
  memberLoading: false,
};

export default connect(
  (state) => {
    const { user, loading } = state.users.auth;
    return {
      member: user && user.member,
      memberLoading: loading,
    };
  },
  null,
  null,
  { pure: false },
)(DashboardContainer);

const NavBox = ({
  icon,
  title,
  to,
}) => (
  <Link
    to={to}
    className="cell large-6 medium-6 app-item"
    style={{
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: '#333',
      color: 'white',
    }}
  >
    <i
      className="material-icons"
      style={{
        fontSize: '350%',
      }}
    >
      {icon}
    </i>
    <strong
      style={{
        fontSize: '200%',
      }}
    >
      {title}
    </strong>
  </Link>
);

NavBox.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
