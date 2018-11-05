const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
// const uniqueValidator = require('mongoose-unique-validator');
const URLSlugs = require('mongoose-url-slugs');

const { Schema } = mongoose;

const EventSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    // unique: true,
    default: uuidv1,
  },

  locationUuid: { type: String, required: true },
  title: { type: String, required: true },

  image: { type: String },
  body: { type: String, required: true },

  startDate: { type: Number, required: true },
  endDate: { type: Number, required: true },
  category: { type: String, required: true },

  featured: { type: Boolean },
  chapterFeatured: { type: Boolean },
  marquee: { type: Boolean },

  eventUrl: { type: String },
  ticketUrl: { type: String },

  created: { type: Number, default: Date.now() },
}, { id: true });


EventSchema.virtual('location', {
  ref: 'location',
  localField: 'locationUuid',
  foreignField: 'uuid',
  justOne: true,
});

EventSchema.set('toObject', { virtuals: true });
EventSchema.set('toJSON', { virtuals: true });
// EventSchema.plugin(uniqueValidator);
EventSchema.plugin(URLSlugs('title'));


const Event = mongoose.model('event', EventSchema);

module.exports = Event;
