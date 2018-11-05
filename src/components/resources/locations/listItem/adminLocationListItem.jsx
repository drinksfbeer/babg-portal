import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';

const LocationListItem = ({
  location,
  containerClass,
  isAdmin,
}) => (
  <Link
    to={isAdmin ? `/location/${location._id}` : ''}
    className={containerClass}
    onClick={isAdmin ? null : e => e.preventDefault()}
  >
    <div className="grid-x grid-padding-x grid-padding-y">
      <div className="cell text-center">
        <h5 style={{ paddingTop: '20px' }}>
          {location.name}
        </h5>
        <div style={{ fontSize: '80%', paddingBottom: '20px' }}>
          <p style={{ marginBottom: '0' }}>
            {location.street}
            {location.street2 && `, ${location.street2}`}
          </p>
          <p style={{ marginBottom: '0' }}>
            {location.city}, {location.state} {location.zip}
          </p>
        </div>
      </div>
    </div>
    <div style={{ height: '250px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDDnfx7o6BF_mmUHBO8UyWzefktjxbJTSI' }}
        center={[location.coords[1] || 32.9157, location.coords[0] || -117.1611]}
        zoom={15}
        options={{ scrollwheel: false }}
      >
        <MapPoint
          lat={location.coords[1]}
          lng={location.coords[0]}
          name={location.name}
          image={location.member.image}
          key={location._id}
        />
      </GoogleMapReact>
    </div>
  </Link>
);

LocationListItem.propTypes = {
  location: PropTypes.shape({
    coords: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    name: PropTypes.string.isRequired,
    member: PropTypes.shape({
      image: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  containerClass: PropTypes.string,
  isAdmin: PropTypes.bool,
};

LocationListItem.defaultProps = {
  containerClass: '',
  isAdmin: true,
};

export default LocationListItem;


const MapPoint = ({ name, image }) => (
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

MapPoint.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};
