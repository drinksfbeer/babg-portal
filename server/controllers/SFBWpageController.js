const SFBWPage = require('../models/SFBWpage');
const crud = require('./default/crud');

const SFBWpagesController = crud(SFBWPage);

SFBWpagesController.create = (req, res) => {
  const { pkg } = req.body;
  const newItem = new SFBWPage(pkg);
  newItem.save((err, savedItem) => {
    if (err) {
      console.log('Error occurred creating resource', err);
      console.log(err);
      return res.status(400).json({ err });
    }
    return res.json(savedItem);
  });
};
module.exports = SFBWpagesController;
