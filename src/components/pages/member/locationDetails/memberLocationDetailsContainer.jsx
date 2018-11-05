import React from 'react';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SectionHeader from '../../../common/sectionHeader/sectionHeader';
import Actions from '../../../../redux/actions/index';
import LocationDetails from '../../../resources/locations/details/adminLocationDetails';
import LocationsForm from '../../../resources/locations/form/locationform';
import DeleteConfirmation from '../../../common/prompts/confirmation';

const LocationDetailsContainer = ({
  match: {
    params: {
      id,
    },
  },
  history,
  asyncAction,
  locations,
}) => {
  const foundLocation = locations.find(location => location._id === id);
  if (!foundLocation) return null;
  const { member } = foundLocation;

  return (
    <div>
      <SectionHeader
        replaceHistory
        title="Location"
        icon="place"
        sections={[{
          title: 'Back',
          icon: 'chevron_left',
          color: 'rgba(0,0,0,0.6)',
        }, {
          title: 'See Details',
          icon: 'pageview',
          to: `/location/${foundLocation._id}`,
        }, {
          title: 'Edit Location',
          icon: 'edit',
          to: `/location/${foundLocation._id}/edit`,
        }, {
          title: 'Delete Location',
          icon: 'delete_forever',
          to: `/location/${foundLocation._id}/delete`,
          color: '#cc4b37',
        }]}
      />
      <Route
        exact
        path="/location/:id"
        render={() => (
          <div className="sectionPadding">
            <LocationDetails
              location={foundLocation}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/location/:id/edit"
        render={() => (
          <div
            style={{ paddingTop: '20px' }}
            className="grid-container"
          >
            <LocationsForm
              location={foundLocation}
              member={member}
            />
          </div>
        )}
      />
      <Route
        exact
        path="/location/:id/delete"
        render={() => (
          <div style={{ paddingTop: '40px' }}>
            <DeleteConfirmation
              message="Are you sure you want to delete this location and all its events?"
              onSubmit={() => asyncAction(
                'deleteLocation',
                { _id: id },
                '',
                (err, data) => {
                  if (data && !err) {
                    history.replace('/locations');
                  }
                },
              )}
            />
          </div>)
        }
      />
    </div>
  );
};

LocationDetailsContainer.defaultProps = {
  locations: [],
};

LocationDetailsContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  asyncAction: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    member: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  })),
};

export default connect(
  state => ({
    user: state.users.auth.user,
    locations: state.locations.list._list,
  }),
  dispatch => ({
    asyncAction: bindActionCreators(Actions.asyncAction, dispatch),
  }),
  null,
  { pure: false },
)(LocationDetailsContainer);
