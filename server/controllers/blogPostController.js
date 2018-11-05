const BlogPost = require('../models/blogPost');
const crud = require('./default/crud');

const blogController = crud(BlogPost);

blogController.index = async (req, res) => {
  const { query } = req;
  const { chapterUuid } = query;

  // non-chapter returns all pages not belonging to a chapter page
  // so only will return guild wide pages
  const chapterUuidQuery = chapterUuid === 'non-chapter' ? { $exists: false } : chapterUuid;

  const foundBlogPosts = await BlogPost
    .find({ ...query, chapterUuid: chapterUuidQuery })
    .populate('chapter');

  if (foundBlogPosts) {
    return res.json(foundBlogPosts);
  }
  return res.status(400);
};

blogController.create = (req, res) => {
  const { pkg } = req.body;
  const newItem = new BlogPost(pkg);
  newItem.save((err, savedItem) => {
    if (err) {
      console.log('Error occurred creating resource', err);
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.json(savedItem);
  });
};
module.exports = blogController;

