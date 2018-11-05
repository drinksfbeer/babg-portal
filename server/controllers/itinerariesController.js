const User = require('../models/user');
const PublicEvent = require('../models/publicEvent');
const Member = require('../models/member');
const Itinerary = require('../models/itinerary');
const itinerariesController = {};

itinerariesController.index = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const userItinerary = await Itinerary.findOne({ userId });
    if (!userItinerary) {
      return res.status(404).json({ err: 'itinerary_not_found' });
    }

    return res.json([
      ...userItinerary.eventIds,
      ...userItinerary.memberIds,
    ]);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

itinerariesController.update = async (req, res) => {
  const {
    userId,
    eventId,
    memberId,
    remove = false,
  } = req.body;

  // either `eventId` or `breweryId` must be present
  if (!userId || !(!eventId ^ !memberId)) { // eslint-disable-line no-bitwise
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // verify that the user is a valid user
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ err: 'user_not_found' });
    }
    if (foundUser.role !== 'enthusiast') {
      return res.status(403).json({ err: 'user_role_forbidden' });
    }

    // find the user's itinerary
    let userItinerary = await Itinerary.findOne({ userId });
    if (!userItinerary) {
      // create a new itinerary for the user since it doesn't exist yet
      userItinerary = new Itinerary({
        userId,
        eventIds: [],
        memberIds: [],
      });
    }

    // determine whether we're modifying events or breweries
    const key = eventId ? 'eventIds' : 'memberIds';
    const value = eventId || memberId;
    const Resource = eventId ? PublicEvent : Member;

    // add or remove the eventId/memberId depending on the `remove` flag
    const index = userItinerary[key].findIndex(id => id === value);
    if (remove) {
      // only remove it if something was found, duh (but don't error out)
      if (index > -1) userItinerary[key].splice(index, 1);
    } else {
      // verify that the event/member is valid
      const foundResource = await Resource.findById(value);
      if (!foundResource) {
        return res.status(404).json({ err: 'resource_not_found' });
      }

      // only add if it doesn't exist, also duh
      if (index < 0) userItinerary[key].push(value);
    }

    // update the user's itinerary in the database
    const updatedItinerary = await userItinerary.save();
    return res.json({
      eventIds: updatedItinerary.eventIds,
      memberIds: updatedItinerary.memberIds,
      userId: updatedItinerary.userId,
    });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = itinerariesController;
