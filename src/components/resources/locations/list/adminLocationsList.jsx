import PropTypes from 'prop-types';
import React from 'react';

// import AdminFormHeaderItem from '../../forms/header/adminFormHeaderItem';
import LocationListItem from '../listItem/adminLocationListItem';

const AdminLocationsList = ({
  locations,
  isAdmin,
}) => (
  <div className="grid-x grid-margin-x grid-margin-y">
    {/* <AdminFormHeaderItem
      title="Event Venues"
    /> */}
    {locations.length > 0 ? (locations.map(location => (
      <div
        key={location._id}
        className="app-item cell large-4 medium-6 small-10"
      >
        <LocationListItem
          location={location}
          isAdmin={isAdmin}
        />
      </div>
    ))) : (
      <div className="cell">No Locations</div>
    )}
  </div>
);
AdminLocationsList.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  isAdmin: PropTypes.bool,
};

AdminLocationsList.defaultProps = {
  locations: [],
  isAdmin: true,
};
export default AdminLocationsList;
