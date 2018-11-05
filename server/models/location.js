const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uuidv1 = require('uuid/v1');
const { geocodeAddress } = require('../services/geocoding');

const { Schema } = mongoose;

const LocationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv1,
  },
  memberUuid: {
    type: String,
    required: true,
  },
  chapterUuid: { type: String },
  street: { type: String, required: true },
  street2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  coords: { type: [Number], required: true }, // always long, then lat
  stage: { type: String },
  profileLocation: { type: Boolean },
  bannerImage: { type: String },
  phone: { type: String },
  hoursMonday: { type: String },
  hoursTuesday: { type: String },
  hoursWednesday: { type: String },
  hoursThursday: { type: String },
  hoursFriday: { type: String },
  hoursSaturday: { type: String },
  hoursSunday: { type: String },
  locationOptions: { type: [String] },
  created: { type: Number, default: Date.now() },
}, {
  id: false,
});

LocationSchema.plugin(uniqueValidator);
LocationSchema.virtual('member', {
  ref: 'member',
  localField: 'memberUuid',
  foreignField: 'uuid',
  justOne: true,
});

LocationSchema.statics = {
  createNewLocation(rawLocation) {
    return new Promise((resolve, reject) => {
      if (!rawLocation || !rawLocation.street || !rawLocation.city || !rawLocation.state || !rawLocation.zip) { // eslint-disable-line
        reject(new Error({ err: 'missing parameters' }));
      } else {
        const address = `${rawLocation.street} ${rawLocation.city}, ${rawLocation.state} ${rawLocation.zip}`;
        geocodeAddress(address, (err, coords) => {
          if (err || !coords) {
            reject(new Error({ err: err || 'issue no coords' }));
          } else {
            const { lat, lng } = coords;
            const newLocationInfo = Object.assign(
              {},
              rawLocation,
              {
                coords: [lng, lat],
              },
            );
            const newLocation = new this(newLocationInfo);
            newLocation.save((err, savedLocation) => {
              if (err || !savedLocation) {
                console.log(err)
                reject(new Error({ err: err || 'save could not occur' }));
              } else {
                resolve(savedLocation);
              }
            });
          }
        });
      }
    });
  },
  editLocation(id, rawLocation) {
    return new Promise((resolve, reject) => {
      const address = `${rawLocation.street} ${rawLocation.city}, ${rawLocation.state} ${rawLocation.zip}`;
      geocodeAddress(address, (err, coords) => {
        if (err || !coords) {
          reject(new Error({ err: err || 'issue no coords' }));
        } else {
          const { lat, lng } = coords;
          const newLocationInfo = Object.assign(
            {},
            rawLocation,
            {
              coords: [lng, lat],
            },
          );
          const options = {
            runValidators: true,
            new: true,
          };
          Location
            .findOneAndUpdate({ _id: id }, newLocationInfo, options)
            .populate('member')
            .then((updatedLocation) => {
              resolve(updatedLocation);
            })
            .catch((error) => {
              reject(new Error({ err: error || 'save could not occur' }));
            });
        }
      });
    });
  },
};


LocationSchema.set('toObject', { virtuals: true });
LocationSchema.set('toJSON', { virtuals: true });
LocationSchema.index({ coords: '2dsphere' });

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
