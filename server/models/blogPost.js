const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlogPostSchema = new Schema({
  name: { type: String, required: true },
  slug: {
    type: String,
    required: true,
    // unique: true,
    sparse: true,
  },
  chapterUuid: { type: String },
  sections: [Schema.Types.Mixed], // each is a black box
  tags: {
    type: String,
  },
  description: {
    type: String,
    default: 'Reviving the vibrant heritage of beer brewing in San Francisco since 2004.',
  },
  image: { type: String },
  lastEditedByName: { type: String },
  lastEditedByDate: { type: Number },
  hidden: { type: Boolean },
  created: { type: Number, default: Date.now() },
}, {
  // strict: false,
});

BlogPostSchema.pre('save', async function preSave(next) {
  const { chapterUuid, slug } = this;
  if (!slug) {
    next(new Error('Slug is missing'));
  }
  const foundBlogPost = await BlogPost.findOne({ // eslint-disable-line
    chapterUuid: chapterUuid || { $exists: false },
    slug,
  });
  if (foundBlogPost) {
    next(new Error(`Slug already exists ${chapterUuid ? 'for a chapter' : ''}`));
  } else {
    next();
  }
});

BlogPostSchema.virtual('chapter', {
  ref: 'chapter',
  localField: 'chapterUuid',
  foreignField: 'uuid',
  justOne: true,
});
BlogPostSchema.set('toObject', { virtuals: true });
BlogPostSchema.set('toJSON', { virtuals: true });

const BlogPost = mongoose.model('blogPost', BlogPostSchema);
module.exports = BlogPost;
