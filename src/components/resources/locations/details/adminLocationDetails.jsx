import React from 'react';
import PropTypes from 'prop-types';
import LocationsMap from '../common/locationsMap';
import { locationStages, locationOptions } from '../../../../refs/refs';

const locationStagesIndices = locationStages.map(stage => stage.value);
const locationOptionsIndices = locationOptions.map(option => option.value);

const AdminLocationDetails = ({ location }) => {
  const locationStageIndex = locationStagesIndices.indexOf(location.stage);
  const locationStage = locationStages[locationStageIndex];

  return (
    <div>
      <h2>{location.name}</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '200px',
          margin: '1em 0',
          padding: '10px',
          color: locationStage.color,
          backgroundColor: locationStage.badgeColor,
          borderRadius: '3px',
          userSelect: 'none',
        }}
      >
        <i className="material-icons" style={{ paddingRight: '10px' }}>
          {locationStage.icon}
        </i>
        <b>{locationStage.label}</b>
      </div>
      <div
        style={{
          fontWeight: '800',
        }}
      >
        {location.profileLocation ? (
          'Brewery Location'
        ) : (
          ' Event Only Venue'
        )}
      </div>
      <div
        style={{
          margin: '10px 0px',
        }}
      >
        <p style={{ marginBottom: '0' }}>
          {location.street}
        </p>
        {
          location.street2 &&
          <p style={{ marginBottom: '0' }}>
            {location.street2}
          </p>
        }
        <p style={{ marginBottom: '0' }}>
          {location.city}, {location.state} {location.zip}
        </p>
      </div>
      <div style={{ margin: '1em 0' }}>
        <div style={{ fontWeight: '800' }}>
          Location Options
        </div>
        {
          location.locationOptions.length < 1 &&
          <div style={{ margin: '10px 0', opacity: '0.5' }}>
            (none)
          </div>
        }
        {
          location.locationOptions.length > 0 &&
          <div style={{ margin: '10px 0' }}>
            {location.locationOptions.map((option, i) => {
              const index = locationOptionsIndices.indexOf(option);
              if (index < 0) return null;
              const { label } = locationOptions[index];
              const isLast = i === location.locationOptions.length - 1;

              return (
                <span key={option}>
                  {label}
                  {isLast ? '' : ', '}
                </span>
              );
            })}
          </div>
        }
      </div>
      <LocationsMap height="400px" locations={[location]} />
    </div>
  );
};

AdminLocationDetails.defaultProps = {
  location: null,
};

AdminLocationDetails.propTypes = {
  location: PropTypes.shape({
    name: PropTypes.string.isRequired,
    coords: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  }),
};

export default AdminLocationDetails;
