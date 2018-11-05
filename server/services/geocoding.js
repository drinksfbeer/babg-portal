const fetch = require('node-fetch');

const url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyASZxkQG-FSxciuiuxnNc-9HOLVHUiPWA8&address=';

const geocodeAddress = (address, cb) => {
  fetch(url + encodeURIComponent(address))
    .then((response) => {
      if (response.ok) {
        response.json().then((googleObject) => {
          try {
            const { lat, lng } = googleObject.results[0].geometry.location;
            cb(null, { lat, lng });
          } catch (error) {
            console.log(error); // eslint-disable-line no-console
            cb(error);
          }
        });
      } else {
        console.log('geocode fail'); // eslint-disable-line no-console
        cb({ err: 'geocode fail' });
      }
    }).catch((error) => {
      console.log(error); // eslint-disable-line no-console
      cb(error);
    });
};

const geocodeAddressAsync = address => new Promise((resolve, reject) => {
  geocodeAddress(address, (err, coords) => {
    if (err) return reject(err);
    return resolve(coords);
  });
});

module.exports = {
  geocodeAddress,
  geocodeAddressAsync,
};
