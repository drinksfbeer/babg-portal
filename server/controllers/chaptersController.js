const Chapter = require('../models/chapter');
const crud = require('./default/crud');

const chaptersController = crud(Chapter);

chaptersController.index = (req, res) => {
  const { query } = req;
  Chapter
    .find(query)
    // .populate('members')
    .exec((err, chapters) => {
      if (err) {
        return res.status(400);
      }
      return res.json(chapters);
    });
};

chaptersController.update = (req, res) => {
  const options = {
    runValidators: true,
    new: true,
  };
  const { changes, _id } = req.body;
  delete changes._id;
  Chapter
    .findOneAndUpdate({ _id }, { $set: changes }, options)
    .populate('members')
    .exec((err, updatedItem) => {
      if (err) {
        console.log('Error occurred updating resource', err);
        return res.status(422).json({ err });
      }
      return res.json(updatedItem);
    });
};

module.exports = chaptersController;
