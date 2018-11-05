const mongoose = require('mongoose');

const { Schema } = mongoose;

const PageSchema = new Schema({
  name: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    // unique: true,
    sparse: true,
  },
  chapterUuid: { type: String },
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
  activeOnHeader: { type: Boolean },
  headerTitle: { type: String },
  headerIcon: { type: String },
  created: { type: Number, default: Date.now() },

  // these are keys used in special pages (such as the login page)
  special: { type: Boolean },
  loginImage: { type: String },
}, {
  // strict: false,
});

PageSchema.pre('save', async function preSave(next) {
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

PageSchema.virtual('chapter', {
  ref: 'chapter',
  localField: 'chapterUuid',
  foreignField: 'uuid',
  justOne: true,
});
PageSchema.set('toObject', { virtuals: true });
PageSchema.set('toJSON', { virtuals: true });

const Page = mongoose.model('page', PageSchema);
module.exports = Page;
