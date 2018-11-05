const Announcement = require('../models/announcement');
const crud = require('./default/crud');

const announcementsController = crud(Announcement);

announcementsController.index = (req, res) => {
  const { query } = req;
  Announcement
    .find(query)
    .sort({ created: -1 })
    .select('-__v')
    .limit(50)
    .then(foundAnnouncements => res.json(foundAnnouncements))
    .catch(error => res.status(400).json({ error }));
};

module.exports = announcementsController;
