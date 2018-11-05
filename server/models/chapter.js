const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uuidv1 = require('uuid/v1');

const { Schema } = mongoose;

const ChapterSchema = new Schema({
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
  color: { type: String },
  icon: { type: String },
  subdomain: { type: String },
  image: { type: String },
  slug: {
    type: String,
    // unique: true,
    trim: true,
  },
  created: { type: Number, default: Date.now },
}, {
  id: false,
});

ChapterSchema.plugin(uniqueValidator);

ChapterSchema.virtual('members', {
  ref: 'member',
  localField: 'uuid',
  foreignField: 'chapterUuid',
});

ChapterSchema.virtual('blogPosts', {
  ref: 'blogPost',
  localField: 'uuid',
  foreignField: 'chapterUuid',
});

ChapterSchema.set('toObject', { virtuals: true });
ChapterSchema.set('toJSON', { virtuals: true });

const Chapter = mongoose.model('chapter', ChapterSchema);

module.exports = Chapter;
