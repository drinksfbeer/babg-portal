import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AdminLocationsNav = ({
  member,
}) => (
  <div>
    <Link
      to={`/member/${member._id}/locations/new`}
      className="button"
    >
      New Location
    </Link>
  </div>
);

AdminLocationsNav.propTypes = {
  member: PropTypes.shape({}),
};

AdminLocationsNav.defaultProps = {
  member: null,
};
export default AdminLocationsNav;
