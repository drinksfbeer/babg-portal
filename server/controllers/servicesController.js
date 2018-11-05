// const User = require('../models/user');
// const prettyError = require('../helpers/prettyError');
const { contactForm } = require('../services/nodeMailer');
const { geocodeAddress } = require('../services/geocoding');
const googleServices = require('../services/google');
const { uploadToS3, uploadEventImage } = require('../services/imageUpload');


const publicContactForm = (req, res) => {
  const {
    message, email, first, last, toEmail,
  } = req.body;
  try {
    res.status(200).json({ message: 'Sent' });
    contactForm(message, email, first, last, toEmail);
  } catch (error) {
    if (error) res.status(500).json({ err: error });
  }
};

const geocodeStuff = (req, res) => {
  const { q } = req.query;
  if (q) {
    geocodeAddress(q, (err, coords) => {
      if (err || !coords || !coords.lat || !coords.lng) {
        res.status(500).json({ err: 'could not fulfill google query' });
      } else {
        res.json({
          lng: coords.lng,
          lat: coords.lat,
        });
      }
    });
  } else {
    res.status(401).json({ err: 'no query parameter for geocoding' });
  }
};

const getGoogleDetails = (req, res) => {
  googleServices.getGoogleDetails(req.body.location, res);
};


const imageUpload = (req, res) => {
  uploadToS3(req, res);
};

const eventImageUpload = (req, res) => {
  uploadEventImage(req, res);
};

module.exports = {
  publicContactForm,
  geocodeStuff,
  imageUpload,
  eventImageUpload,
  getGoogleDetails,
};
