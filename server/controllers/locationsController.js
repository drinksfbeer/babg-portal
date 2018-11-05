const Location = require('../models/location');
const crud = require('./default/crud');

const locationsController = crud(Location);

locationsController.index = (req, res) => {
  const { query } = req;
  Location
    .find(query)
    .populate('member')
    .then(foundLocations => res.json(foundLocations))
    .catch(error => res.status(400).json({ error }));
};

locationsController.create = (req, res) => {
  const { pkg } = req.body;
  Location
    .createNewLocation(pkg)
    .then((newLocation) => {
      Location.populate(
        newLocation,
        {
          path: 'member',
        },
        (err, populatedLocation) => {
          if (!err && populatedLocation && populatedLocation.member) {
            return res.json(populatedLocation);
          }
          return res.status(400);
        },
      );
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line
      res.status(400).json({ err });
    });
};

locationsController.update = (req, res) => {
  const { changes, _id } = req.body;
  Location
    .editLocation(_id, changes)
    .then(updatedItem => res.json(updatedItem))
    .catch((err) => {
      console.log(err); // eslint-disable-line
      res.status(400).json({ err });
    });
};
module.exports = locationsController;
