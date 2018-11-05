const mongoose = require('mongoose');
const { geocodeAddressAsync } = require('../services/geocoding');

const { Schema } = mongoose;

const PublicEventSchema = new Schema({
  masterId: { type: String }, // references the original version of the event
  userId: { type: String, required: true },
  chapterUuid: { type: String, required: true },
  title: { type: String, required: true },
  location: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'US' },
    coords: { type: [Number], required: true }, // [long, lat]
  },
  eventType: {
    type: String,
    enum: [
      'unique',
      'week_long',
    ],
    required: true,
  },

  featured: { type: Boolean, default: false },
  marquee: { type: Boolean, default: false },

  // if `eventType` is `unique`
  date: { type: Number },
  startTime: { type: Number },
  endTime: { type: Number },

  // if `eventType` is `week_long`
  startDate: { type: Number },
  endDate: { type: Number },

  category: {
    type: String,
    enum: [
      'beer_dinner',
      'food_pairings',
      'special_release',
      'festival_celebration',
      'tap_takeover',
      'meet_the_brewers',
      'at_brewery',
      'tour',
      'education',
      'fundraiser',
      'other_unique',
      'outdoor_activity',
    ],
    required: true,
  },

  // if `category` is `meet_the_brewers`
  brewerStart: { type: Number },
  brewerEnd: { type: Number },

  admissionPrice: { type: Number, default: 0 },
  eventUrl: { type: String },
  ticketUrl: { type: String },
  image: { type: String },
  body: { type: String, required: true },
  contact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  stripe: {
    amount: { type: Number },
    cardId: { type: String },
    chargeId: { type: String },
    transactionId: { type: String },
    refunded: { type: Boolean, default: false },
    refundId: { type: String },
  },
  created: { type: Number, default: Date.now() },
});

PublicEventSchema.statics = {
  createNewLocation(rawEvent) {
    return new Promise(async (resolve, reject) => {
      const { location: rawLocation } = rawEvent;

      if (!rawLocation || !rawLocation.street || !rawLocation.city || !rawLocation.state) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('missing_parameters');
      } else {
        const {
          street,
          city,
          state,
          zip,
        } = rawLocation;
        const address = `${street}, ${city}, ${state} ${zip}`;

        try {
          const coords = await geocodeAddressAsync(address);
          const { lat, lng } = coords;
          const newLocationInfo = Object.assign({}, rawLocation, {
            coords: [
              lng,
              lat,
            ],
          });
          const newEvent = new this({ ...rawEvent, location: newLocationInfo });
          resolve((await newEvent.save()));
        } catch (error) {
          reject(error);
        }
      }
    });
  },
  editLocation(id, rawEvent) {
    return new Promise(async (resolve, reject) => {
      const { location: rawLocation } = rawEvent;
      const {
        street,
        city,
        state,
        zip,
      } = rawLocation;
      const address = `${street}, ${city}, ${state} ${zip}`;

      try {
        const coords = await geocodeAddressAsync(address);
        const { lat, lng } = coords;
        const newLocationInfo = Object.assign({}, rawLocation, {
          coords: [
            lng,
            lat,
          ],
        });
        // eslint-disable-next-line no-use-before-define
        const updatedEvent = await PublicEvent.findByIdAndUpdate(id, {
          ...rawEvent,
          location: newLocationInfo,
        }, {
          new: true,
        });
        resolve(updatedEvent);
      } catch (error) {
        reject(error);
      }
    });
  },
};

PublicEventSchema.virtual('user', {
  ref: 'user',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

PublicEventSchema.set('toObject', { virtuals: true });
PublicEventSchema.set('toJSON', { virtuals: true });

const PublicEvent = mongoose.model('publicevent', PublicEventSchema);

module.exports = PublicEvent;
