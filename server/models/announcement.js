const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
  tag: { type: String },
  body: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
  chapterUuid: { type: String },
  audience: {
    type: String,
    required: true,
    enum: ['members', 'enthusiasts'],
  },
  created: { type: Number, default: Date.now() },
});

const Announcement = mongoose.model('announcement', AnnouncementSchema);

module.exports = Announcement;
