const Event = require('../models/event');
const Location = require('../models/location');
const crud = require('./default/crud');
const moment = require('moment');
const prettyError = require('../helpers/prettyError');
const Notification = require('../models/notification');

const eventsController = crud(Event);

// eventsController.publicIndex = async (req, res) => {
//   const { chapterUuid, ...query } = req;
//   query.startDate = { $gt: moment().startOf('day').valueOf() };
//   query.deactivated = { $ne: true };
//   const foundEvents = await Event
//     .find(query)
//     .sort({ startDate: 1 })
//     .populate({
//       path: 'location',
//       select: '-country -__v -created -id -deactivated -visible',
//       populate: {
//         path: 'member',
//         select: '-created -website -facebook -instagram -twitter -type ' +
//           '-locations -id -__v -deactivated -visible',
//         match: {
//           chapterUuid: chapterUuid || { $exists: true },
//         },
//       },
//     });
//   if (foundEvents) {
//     res.json(foundEvents);
//   } else {
//     res.status(401);
//   }
// };

eventsController.index = (req, res) => {
  const { query: allQueryParams } = req;
  const { chapterUuid, ...query } = allQueryParams;
  if (query.startDate === 'new') {
    delete query.startDate;
    query.startDate = { $gt: moment().startOf('day').valueOf() };
  }
  Event
    .find(query)
    .select('-__v')
    .sort({
      startDate: 1,
    })
    .populate({
      path: 'location',
      select: '-country -__v -created -id -deactivated -visible',
      populate: {
        path: 'member',
        select: '-created -website -facebook -instagram -twitter -type -locations -id -__v -deactivated -visible',
        match: {
          chapterUuid: chapterUuid ? { $eq: chapterUuid } : { $exists: true },
        },
      },
    })
    .then((events) => {
      const filteredEvents = events
        .filter(event => event.location && event.location.member);

      return res.json(filteredEvents);
    })
    .catch(e => res.status(401).json({ error: e }));
};

eventsController.update = (req, res) => {
  const options = {
    runValidators: true,
    new: true,
  };
  const { changes, _id } = req.body;

  if (changes.locationUuid === 'new') {
    Location
      .createNewLocation(changes.location)
      .then((newLocation) => {
        const rawEvent = changes;
        rawEvent.locationUuid = newLocation.uuid;
        Event
          .findOneAndUpdate({ _id }, rawEvent, options)
          .populate({
            path: 'location',
            select: '-country -__v -created -id -deactivated -visible',
            populate: {
              path: 'member',
              select: '-created -website -facebook -instagram -twitter -type -locations -id -__v -deactivated -visible',
            },
          })
          .then((event) => {
            res.json(event);
          });
      })
      .catch(err => res.status(400).json({ err: prettyError(err) }));
    return null;
  }
  Event
    .findOneAndUpdate({ _id }, changes, options)
    .populate({
      path: 'location',
      select: '-country -__v -created -id -deactivated -visible',
      populate: {
        path: 'member',
        select: '-created -website -facebook -instagram -twitter -type -locations -id -__v -deactivated -visible',
      },
    })
    .then((event) => {
      res.json(event);
    })
    .catch(() => {
      res.status(401).json({ err: 'error updated' });
    });

  return null;
};

eventsController.create = (req, res) => {
  const { pkg } = req.body;
  if (pkg.locationUuid === 'new') {
    Location
      .createNewLocation(pkg.location)
      .then((newLocation) => {
        const rawEvent = pkg;
        rawEvent.locationUuid = newLocation.uuid;
        const newEvent = new Event(rawEvent);
        newEvent.save((err, savedItem) => {
          if (err) {
            console.log('Error occurred creating event', err); // eslint-disable-line
            return res.status(400).json({ err: prettyError(err) });
          }
          Event.populate(savedItem, {
            path: 'location',
            populate: {
              path: 'member',
            },
          }).then((populatedEvent) => {
            res.json(populatedEvent);
            new Notification({
              type: 'event',
              tag: 'new',
              image: populatedEvent.location.member.image,
              title: `${populatedEvent.location.member.name} has added a new Event`,
              body: `${populatedEvent.title} has been created at the ${populatedEvent.location.name} location of ${populatedEvent.location.member.name}`,
              memberUuid: populatedEvent.location.member.uuid,
              itemId: populatedEvent._id,
            }).save();
            // }).save(console.log);
          });
        });
      })
      .catch((err) => {
        console.log('Error occurred creating event location', err); // eslint-disable-line
        return res.status(400).json({ err: prettyError(err) });
      });
  } else {
    const newEvent = new Event(pkg);
    newEvent
      .save((err, savedItem) => {
        if (err) {
          console.log('Error occurred creating event', err); // eslint-disable-line
          return res.status(400).json({ err: prettyError(err) });
        }

        Event.populate(savedItem, {
          path: 'location',
          populate: {
            path: 'member',
          },
        }, () => {
          res.json(savedItem);
          new Notification({
            type: 'event',
            tag: 'new',
            image: savedItem.location.member.image,
            title: `${savedItem.location.member.name} has added a new Event`,
            body: `${savedItem.title} has been created at the ${savedItem.location.name} location of ${savedItem.location.member.name}`,
            memberUuid: savedItem.location.member.uuid,
            itemId: savedItem._id,
          }).save();
          // }).save(console.log);
        });
      });
  }
};

module.exports = eventsController;
