const mongoose = require('mongoose');

const { Schema } = mongoose;

const SFBWPageSchema = new Schema({
  subPageName: { type: String },
  subPageSlug: {
    type: String,
    // unique: true,
    sparse: true,
  },
  mainPageName: { type: String, required: true },
  mainPageSlug: {
    type: String,
    required: true,
    // unique: true,
    sparse: true,
  },
  sections: [Schema.Types.Mixed], // each is a black box
  metaTitle: {
    type: String,
    default: 'Bay Area Brewers Guild',
  },
  metaDescription: {
    type: String,
    default: 'Reviving the vibrant heritage of beer brewing in San Francisco since 2004.',
  },
  metaImage: { type: String },
  lastEditedByName: { type: String },
  lastEditedByDate: { type: Number },
  hidden: { type: Boolean },
  isASubPage: { type: Boolean, default: false },
  headerIcon: { type: String },
  created: { type: Number, default: Date.now() },

}, {
  // strict: false,
});

SFBWPageSchema.pre('save', async function preSave(next) {
  const { chapterUuid, slug } = this;
  if (!slug) {
    next(new Error('Slug is missing'));
  }
  const foundPage = await Page.findOne({ // eslint-disable-line
    chapterUuid: chapterUuid || { $exists: false },
    slug,
  });
  if (foundPage) {
    next(new Error(`Slug already exists ${chapterUuid ? 'for a chapter' : ''}`));
  } else {
    next();
  }
});

SFBWPageSchema.virtual('chapter', {
  ref: 'chapter',
  localField: 'chapterUuid',
  foreignField: 'uuid',
  justOne: true,
});
SFBWPageSchema.set('toObject', { virtuals: true });
SFBWPageSchema.set('toJSON', { virtuals: true });

const Page = mongoose.model('SFBWpage', SFBWPageSchema);
module.exports = Page;
