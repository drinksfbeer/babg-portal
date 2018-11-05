import React from 'react';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';

const LocationsMap = ({ locations, height }) => (
  <div style={{ height }}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: 'AIzaSyDDnfx7o6BF_mmUHBO8UyWzefktjxbJTSI' }}
      center={[
        (locations[0] && locations[0].coords[1]) || 32.9157,
        (locations[0] && locations[0].coords[0]) || -117.1611,
      ]}
      zoom={9}
      options={{
        scrollwheel: false,
      }}
    >
      {locations.map((location, i) => (
        <MapPoint
          lat={location.coords[1]}
          lng={location.coords[0]}
          name={location.name}
          image={location.member ? location.member.image : 'https://cdn2.iconfinder.com/data/icons/perfect-flat-icons-2/512/Location_marker_pin_map_gps.png'}
          key={location._id || i}
        />
      ))}
    </GoogleMapReact>
  </div>
);

const MapPoint = ({ name, image }) => ( // eslint-disable-line
  <div
    style={{
      backgroundColor: 'white',
      backgroundImage: `url(${image})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      borderRadius: '100%',
      height: '45px',
      width: '45px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
    }}
    className="map-point"
  >
    <span
      style={{
        marginBottom: '100px',
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '5px',
        minWidth: '200px',
        justifyContent: 'center',
      }}
    >
      {name}
    </span>
  </div>
);

LocationsMap.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    coords: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    name: PropTypes.string.isRequired,
  })),
  height: PropTypes.string,
};

LocationsMap.defaultProps = {
  locations: [],
  height: '200px',
};

export default LocationsMap;
