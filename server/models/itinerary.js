// imported from `sdbeer2`
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItinerarySchema = new Schema({
  userId: { type: String, required: true },
  eventIds: { type: [String], default: [] },
  memberIds: { type: [String], default: [] },
});

const Itinerary = mongoose.model('itinerary', ItinerarySchema);

module.exports = Itinerary;
