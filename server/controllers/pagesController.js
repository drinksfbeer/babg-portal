const Page = require('../models/page');
const crud = require('./default/crud');

const pagesController = crud(Page);

pagesController.index = async (req, res) => {
  const { query } = req;
  const { chapterUuid } = query;

  // non-chapter returns all pages not belonging to a chapter page
  // so only will return guild wide pages
  const chapterUuidQuery = chapterUuid === 'non-chapter' ? { $exists: false } : chapterUuid;

  const foundPages = await Page
    .find({ ...query, chapterUuid: chapterUuidQuery })
    .populate('chapter');

  if (foundPages) {
    return res.json(foundPages);
  }
  return res.status(400);
};

pagesController.create = (req, res) => {
  const { pkg } = req.body;
  const newItem = new Page(pkg);
  newItem.save((err, savedItem) => {
    if (err) {
      console.log('Error occurred creating resource', err);
      console.log(err);
      return res.status(400).json({ err: prettyError(err) });
    }
    return res.json(savedItem);
  });
};
module.exports = pagesController;
