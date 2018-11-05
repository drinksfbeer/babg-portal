const Settings = require('../models/settings');
const User = require('../models/user');
const crud = require('./default/crud');

const settingsController = crud(Settings);

// no one should be able to create another document in the `settings` collection
// since we use `settings[0]` after indexing the collection, this would break things
// 501 = Not Implemented
settingsController.create = (req, res) => res.sendStatus(501);

// the default `crud` allows ANYONE to update the settings, so this implements
// *some* security even though it's not the best, but it'll have to do for now
settingsController.update = async (req, res) => {
  const { _id, adminId, changes } = req.body;

  if (!_id || !adminId || !changes) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // check to make sure admin exists and has role 'master'
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'user_not_found' });
    }
    if (admin.role !== 'master') {
      return res.status(403).json({ err: 'user_role_forbidden' });
    }

    // proceed with updating the settings
    const updatedSettings = await Settings.findOneAndUpdate({ _id }, changes, {
      runValidators: true,
      new: true,
    });

    return res.json(updatedSettings);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// no one should also be able to delete the settings too
settingsController.destroy = (req, res) => res.sendStatus(501);

module.exports = settingsController;
