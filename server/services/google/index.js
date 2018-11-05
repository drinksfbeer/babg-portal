const fetch = require('node-fetch');

const googleApiKey = '';

const getGoogleDetails = async (userInput, res) => {
  try {
    const googleId = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${userInput}&inputtype=textquery&fields=place_id,formatted_address,name,rating,opening_hours,geometry&key=${googleApiKey}`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'POST, GET',
      },
    }).then(response => response.json());

    const googleDetails = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${googleId.candidates[0].place_id}&fields=name,rating,formatted_phone_number,formatted_address,opening_hours&key=${googleApiKey}`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'POST, GET',
      },
    }).then(response => response.json());
    await res.json(googleDetails);
  } catch (error) {
    if (error) res.send(500).json({ err: error });
  }
};


module.exports = {
  getGoogleDetails,
};
