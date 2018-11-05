const prettyError = require('../../helpers/prettyError');

module.exports = Resource => ({
  index(req, res) {
    const { query } = req;
    Resource.find(query, (err, foundItem) => {
      if (err) {
        console.log(`Error occurred finding resource`, err);
        return res.status(400).json({ err });
      }
      res.json(foundItem);
    });
  },
  create(req, res) {
    const { pkg } = req.body;
    const newItem = new Resource(pkg);
    newItem.save((err, savedItem) => {
      if (err) {
        console.log('Error occurred creating resource', err);
        return res.status(400).json({ err: prettyError(err) });
      }
      res.json(savedItem);
    });
  },
  update(req, res) {
    const options = {
      runValidators: true,
      new: true,
    };
    const { changes, _id } = req.body;
    Resource.findOneAndUpdate({ _id }, changes, options, (err, updatedItem) => {
      if (err) {
        console.log('Error occurred updating resource', err);
        return res.status(422).json({ err });
      }
      res.json(updatedItem);
    });
  },
  show(req, res) {
    const { id } = req.params;
    Resource.findOne({ _id: id }, (err, foundItem) => {
      if (err) {
        console.log('Error occurred find resource', err);
        return res.status(400).json({ err });
      }
      res.json(foundItem);
    });
  },
  destroy(req, res) {
    // destroy
    const { _id } = req.body;

    Resource.findOneAndRemove({ _id }, (err, deletedItem) => {
      if (err || !deletedItem) {
        // console.log(`Error occured deleting ${Resource}`,err)
        return res.status(400).json({ err: err || 'error occured deleting item' });
      }
      res.json({ _id: deletedItem._id });
    });
  },
});
