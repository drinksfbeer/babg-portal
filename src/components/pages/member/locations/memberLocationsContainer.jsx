import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import LocationsForm from '../../../resources/locations/form/locationform';
import LocationsList from '../../../resources/locations/list/adminLocationsList';
import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import AdminFormHeaderItem from '../../../resources/forms/header/adminFormHeaderItem';

const ProfileContainer = ({
  member,
  locations,
}) => {
  if (!member) return null;

  return (
    <div>
      <SectionHeader
        title={`${member.name} - Locations`}
        icon="edit_location"
        sections={[{
          title: 'Locations',
          icon: 'edit_location',
          to: '/locations',
          exact: true,
        }, {
          title: 'New Location',
          icon: 'add_location',
          to: '/locations/new',
        }]}
      />
      <Route
        exact
        path="/locations"
        render={() => (
          <div className="sectionPadding">
            <div className="grid-x grid-margin-y">
              <AdminFormHeaderItem
                title="Brewery Locations"
                materialIcon="local_drink"
              />
            </div>
            <LocationsList
              member={member}
              locations={locations.filter(location => location.profileLocation)}
            />
            <div className="grid-x grid-margin-y">
              <AdminFormHeaderItem
                title="Event Only Venues"
                materialIcon="event_available"
              />
            </div>
            <LocationsList
              member={member}
              locations={locations.filter(location => !location.profileLocation)}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/locations/new"
        render={() => (
          <div className="sectionPadding">
            <LocationsForm member={member} />
          </div>
        )}
      />
    </div>
  );
};

ProfileContainer.propTypes = {
  member: PropTypes.shape({}),
  locations: PropTypes.arrayOf(PropTypes.shape({})),
};

ProfileContainer.defaultProps = {
  member: null,
  locations: [],
};

export default connect(
  state => ({
    member: state.users.auth.user && state.users.auth.user.member,
    locations: state.locations.list._list,
  }),
  null,
  null,
  { pure: false },
)(ProfileContainer);
