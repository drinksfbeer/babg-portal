const Notification = require('../models/notification');
const Member = require('../models/member');
const crud = require('./default/crud');

const notificationsController = crud(Notification);

// notificationsController.index = (req, res) => {
//   const { query } = req;
//   Notification
//     .find(query)
//     .sort({ created: -1 })
//     .select('-__v')
//     .limit(50)
//     .then(foundNotifications => res.json(foundNotifications))
//     .catch(error => res.status(400).json({ error }));
// };

notificationsController.index = async (req, res) => {
  const { query: allQueryParams } = req;
  const { chapterUuid, ...query } = allQueryParams;

  try {
    // build list of `memberUuid`s belonging to a chapter (if `chapterUuid` is specified)
    const members = await Member.find({ chapterUuid });
    const memberUuids = members.map(member => member.uuid);
    const memberQuery = memberUuids.length > 0 ? {
      memberUuid: {
        $in: memberUuids,
      },
    } : {};

    // query for list of notifications either petaining to the members (if `chapterUuid`
    // was specified) or all events
    const notifications = await Notification
      .find({
        ...memberQuery,
        ...query,
      })
      .sort({ created: -1 })
      .select('-__v')
      .limit(50);

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = notificationsController;
