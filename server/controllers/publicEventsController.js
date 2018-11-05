const PublicEvent = require('../models/publicEvent');
const PublicEventVersion = require('../models/publicEventVersion');
const User = require('../models/user');
const Settings = require('../models/settings');
const stripe = require('../services/stripe');
const crud = require('./default/crud');

// this helper function duplicates an event with a different `_id`
// also attaches the `masterId` parameter to the duplicated event
const duplicateEvent = event => new Promise(async (resolve, reject) => {
  try {
    const pkg = JSON.parse(JSON.stringify(event)); // deep-copy
    delete pkg._id;
    delete pkg.__v;
    delete pkg.created;

    const duplicatedEvent = new PublicEvent({
      ...pkg,
      masterId: event.masterId ? event.masterId : event._id,
    });
    const savedDuplicatedEvent = await duplicatedEvent.save();

    resolve(savedDuplicatedEvent);
  } catch (error) {
    reject(error);
  }
});

const publicEventsController = {};

// returns the events created by the user
publicEventsController.index = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const foundEvents = await PublicEvent.find({ userId });
    return res.json(foundEvents);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// returns the event versions of the user
publicEventsController.versionIndex = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const foundEventVersion = await PublicEventVersion.findOne({ userId });
    return res.json([foundEventVersion]);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// returns active events created by all users
// useful for displaying the events on the public site
publicEventsController.activeIndex = async (req, res) => {
  try {
    // fetch all of the event versions
    const eventVersions = await PublicEventVersion.find();

    // concat all active event id's into a single array
    const activeIds = [];
    eventVersions.forEach(eventVersion => activeIds.push(...eventVersion.actives));

    // get all of the public active events
    const foundEvents = await PublicEvent.find({
      _id: { $in: activeIds },
    }).populate({
      path: 'user',
      select: 'company -_id',
    });

    return res.json(foundEvents);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

publicEventsController.allIndex = crud(PublicEvent).index;
publicEventsController.allVersionIndex = crud(PublicEventVersion).index;

// creates a new public event
// charges the user with the configured amount in the `settings` collection (`publicEventPrice`)
// (unless the user also has the permission `events_free`, then they won't be charged)
// created events are left in a pending state (unless `isDraft` is `true`)
// if the user does not have a `stripeCustomerId`, one will be automatically created
// only users with the `submit_events` permission are allowed to create events
publicEventsController.create = async (req, res) => {
  const {
    userId,
    isDraft = false,
    eventId, // required if submitting a draft event
    pkg,
  } = req.body;

  if (!userId || !pkg) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const {
      title,
      chapterUuid,
      location, // name, street, street2, city, state, zip, country
      eventType,
      date, // if `eventType` is `unique`
      startTime, // if `eventType` is `unique`
      endTime, // if `eventType` is `unique`
      startDate, // if `eventType` is `week_long`
      endDate, // if `eventType` is `week_long`
      category,
      brewerStart, // if `category` is `meet_the_brewers`
      brewerEnd, // if `category` is `meet_the_brewers`
      // admissionPrice, // <-- unused (but passed to new `PublicEvent` document)
      // eventUrl, // <-- unused " " " "
      // ticketUrl, // <-- unused " " " "
      // image, // <-- unused " " " "
      body,
      contact, // name, email, phone (all type String)
      cardId, // either `cardId` or `card` should exist (not both)
      card,
      saveCard, // only used if `card` exists
    } = pkg;

    if (!userId || (!isDraft && (
      !chapterUuid || !title || !location || !location.name ||
      !location.street || !location.city || !location.state || !location.zip ||
      !eventType || !['unique', 'week_long'].includes(eventType) ||
      (eventType === 'unique' && (!date || !startTime || !endTime)) ||
      (eventType === 'week_long' && (!startDate || !endDate)) ||
      !category || (category === 'meet_the_brewers' && (!brewerStart || !brewerEnd)) ||
      !body || !contact || !contact.name || !contact.email || !contact.phone
    ))) {
      return res.status(400).json({ err: 'missing_parameters' });
    }

    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ err: 'user_not_found' });
    }

    // verify that they have the appropriate permissions to post a public event
    if (!Array.isArray(user.permissions) || !user.permissions.includes('submit_events')) {
      return res.status(403).json({ err: 'insufficient_permissions' });
    }

    // determine event submission fee
    const settingsList = await Settings.find();
    if (!settingsList) {
      return res.status(500).json({ err: 'settings_invalid' });
    }
    const { publicEventUniqueFee, publicEventWeekLongFee } = settingsList[0];
    const publicEventPrice = eventType === 'week_long' ?
      publicEventWeekLongFee : publicEventUniqueFee;

    // remove these fields just in case
    if (eventType === 'unique') {
      delete pkg.startDate;
      delete pkg.endDate;
    }
    if (eventType === 'week_long') {
      delete pkg.date;
      delete pkg.startTime;
      delete pkg.endTime;
    }
    if (category !== 'meet_the_brewers') {
      delete pkg.brewerStart;
      delete pkg.brewerEnd;
    }

    // check if the user has a document for event versions and if not, create one
    let eventVersion = await PublicEventVersion.findOne({ userId });
    if (!eventVersion) {
      const newEventVersion = new PublicEventVersion({ userId });
      eventVersion = await newEventVersion.save();
    }

    // if this event is a draft, simply save the fields to the database
    if (isDraft) {
      const newEvent = await PublicEvent.createNewLocation({ userId, ...pkg });

      // since this event is the first of its kind, we set it as the key of the revisions object
      eventVersion.revisions = {
        ...eventVersion.revisions,
        [newEvent._id]: [],
      };
      eventVersion.drafts.push(newEvent._id);
      await eventVersion.save();

      return res.json(newEvent);
    }

    // at this point, the user is willing to submit the event for review, so check if the
    // event we're going to submit is an existing draft and that it exists
    let feeWaived = user.permissions.includes('events_free');
    let foundEvent;
    if (eventId) {
      foundEvent = await PublicEvent.findById(eventId);
      if (!foundEvent) {
        return res.status(404).json({ err: 'event_not_found' });
      }

      // this is to handle events that were soft-rejected, but submitted again
      feeWaived = feeWaived || (
        foundEvent.stripe.chargeId &&
        foundEvent.stripe.transactionId &&
        !foundEvent.stripe.refunded &&
        !foundEvent.stripe.refundId
      );
    }

    // if the user has the fee waived (or already paid), simply post/update the event
    if (feeWaived) {
      if (eventId) {
        // verify that this event was soft-rejected
        // (since this event would be a duplicate, the version before this one should be rejected)
        const refId = foundEvent.masterId ? foundEvent.masterId : foundEvent._id;
        const versions = eventVersion.revisions[refId];
        const prevId = versions.length > 1 ? versions[versions.length - 2] : refId;
        const wasSoftRejected = eventVersion.rejected.includes(prevId);
        if (!wasSoftRejected) {
          return res.status(400).json({ err: 'event_not_soft_rejected' });
        }

        // update the event
        const updatedEvent = await PublicEvent.editLocation(eventId, { userId, ...pkg });

        // set the event's status to pending
        const draftIndex = eventVersion.drafts.findIndex(id => id === eventId);
        if (draftIndex > -1) eventVersion.drafts.splice(draftIndex, 1);
        eventVersion.pending.push(eventId);
        await eventVersion.save();

        return res.json(updatedEvent);
      }
      const newEvent = await PublicEvent.createNewLocation({
        userId,
        ...pkg,
        stripe: {
          amount: 0,
        },
      });
      return res.json(newEvent);
    }

    // verify required body params for processing payment are present
    // (either `cardId` or `card` must be exclusively present, hence why we're using XNOR)
    // (also the double bangs ['!!'] are to convert the strings to booleans for bitwise)
    const cardNumber = card && card.cardNumber ? card.cardNumber : false;
    const cardExpiry = card && card.cardExpiry ? card.cardExpiry : false;
    const cardCVC = card && card.cardCVC ? card.cardCVC : false;
    const cardZip = card && card.cardZip ? card.cardZip : false;
    // eslint-disable-next-line no-bitwise
    if (!(!!cardId ^ (!!cardNumber && !!cardExpiry && !!cardCVC && !!cardZip))) {
      return res.status(400).json({ err: 'missing_parameters' });
    }

    // this flag is to keep track of whether we need to update the user in the end
    let shouldUpdateUser = false;

    // check if the user has a Stripe customer ID and if not, create one
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({ email: user.email });
      user.stripeCustomerId = customer.id;
      shouldUpdateUser = true;
    }

    // generate token or use passed in `cardId` from `pkg`
    let chargeToken = cardId;
    if (!chargeToken) {
      const [expMonth, expYear] = cardExpiry.split(' / ');
      const token = await stripe.tokens.create({
        card: {
          number: cardNumber.replace(' ', ''),
          exp_month: parseInt(expMonth, 10),
          exp_year: parseInt(expYear, 10),
          cvc: cardCVC,
          address_zip: cardZip,
        },
      });
      chargeToken = token.id;

      // add card to user's list of cards if they specified to do so
      // (also add it to their Stripe account)
      if (saveCard) {
        await stripe.customers.createSource(
          user.stripeCustomerId,
          { source: chargeToken },
        );
        if (!Array.isArray(user.stripeCards)) user.stripeCards = [];
        user.stripeCards.push({
          cardId: token.card.id,
          brand: token.card.brand,
          lastFour: token.card.last4,
        });
        shouldUpdateUser = true;

        // if we're saving the card, we have to change `chargeToken` to the card's ID
        // or else it will error since we're also passing in their customer ID
        chargeToken = token.card.id;
      }
    }

    // proceed with charging the user's credit card
    const isOneTimeCharge = !cardId && !saveCard;
    const charge = await stripe.charges.create({
      amount: publicEventPrice,
      currency: 'usd',
      source: chargeToken,
      // don't pass in a customer ID if it's a one-time charge (or else it will error out)
      customer: isOneTimeCharge ? undefined : user.stripeCustomerId,
      description: 'Bay Area Brewers Guild Event Submission',
    });

    // fill in Stripe transaction info into `pkg`
    pkg.stripe = {
      amount: publicEventPrice,
      cardId: chargeToken,
      chargeId: charge.id,
      transactionId: charge.balance_transaction,
    };

    // if we need to update the user, do so
    if (shouldUpdateUser) await user.save();

    // finally, proceed with event creation/submission (if `eventId` is present)
    if (eventId) {
      const updatedEvent = await PublicEvent.editLocation(eventId, { userId, ...pkg });

      // remove the event from draft status and add to pending
      const draftIndex = eventVersion.drafts.findIndex(id => id === eventId);
      if (draftIndex > -1) eventVersion.drafts.splice(draftIndex, 1); // just in case
      eventVersion.pending.push(eventId);
      await eventVersion.save();

      return res.json(updatedEvent);
    }

    const newEvent = await PublicEvent.createNewLocation({ userId, ...pkg });

    // append the newly created event to the list of revisions and set status to pending
    eventVersion.revisions = {
      ...eventVersion.revisions,
      [newEvent._id]: [],
    };
    eventVersion.pending.push(newEvent._id);
    await eventVersion.save();

    return res.json(newEvent);
  } catch (error) {
    console.log(error); // eslint-disable-line
    return res.status(500).json({ err: error });
  }
};

// approves a public event
// only master admins are allowed to approve events
publicEventsController.approve = async (req, res) => {
  const { _id, adminId } = req.body;

  if (!_id || !adminId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // verify that the user requesting the approval is a master admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'admin_not_found' });
    }
    if (admin.role !== 'master') {
      return res.status(403).json({ err: 'user_role_forbidden' });
    }

    // query for the public event
    const event = await PublicEvent.findById(_id);
    if (!event) {
      return res.status(404).json({ err: 'event_not_found' });
    }

    // query for the user's public event versions
    const eventVersion = await PublicEventVersion.findOne({ userId: event.userId });
    if (!eventVersion) {
      return res.status(404).json({ err: 'event_version_not_found' });
    }

    // verify that the public event wasn't already approved
    if (eventVersion.approved.includes(_id)) {
      return res.status(400).json({ err: 'event_already_approved' });
    }

    // verify that the public event wasn't already rejected
    if (eventVersion.rejected.includes(_id)) {
      return res.status(400).json({ err: 'event_already_rejected' });
    }

    // verify that the public event is currently pending
    if (!eventVersion.pending.includes(_id)) {
      return res.status(400).json({ err: 'event_not_pending' });
    }

    // approve the event
    const pendingIndex = eventVersion.pending.findIndex(id => id === _id);
    if (pendingIndex > -1) eventVersion.pending.splice(pendingIndex, 1);
    eventVersion.approved.push(_id);

    // also, set the version in the active list to the latest version
    const refId = event.masterId ? event.masterId : _id;
    if (Array.isArray(eventVersion.revisions[refId])) {
      // concat id's of the current event web
      const versionIds = [
        refId,
        ...eventVersion.revisions[refId],
      ];

      // if a previous version already exists as an active, replace that current one
      let didUpdate = false;
      for (let i = 0; i < eventVersion.actives.length; i++) {
        const activeId = eventVersion.actives[i];

        // should only be one instance where this will be true tbh
        if (versionIds.includes(activeId)) {
          eventVersion.actives[i] = _id;
          didUpdate = true;
          break;
        }
      }

      // if one doesn't exist, then simply push it to the active list
      if (!didUpdate) eventVersion.actives.push(_id);
    }

    const updatedEventVersion = await eventVersion.save();

    return res.json(updatedEventVersion);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// rejects a public event
// there are two types of rejection: a hard rejection and a soft rejection
// with a hard rejection, the user will be refunded and won't be able to further make changes
// the user will be refunded the amount they paid, as specified in `stripe.amount`
// (this means changing the `publicEventPrice` will have no effect in their refund amount)
// with a soft rejection, the user won't be refunded but still can make further changes
// this is achieved by pushing the original to the rejected list, but duplicating it with a
// new `_id` and pushing that to the pending list
// only master admins are allowed to deny events
publicEventsController.reject = async (req, res) => {
  const { _id, adminId, type } = req.body;

  if (!_id || !adminId || !type || !['hard', 'soft'].includes(type)) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // verify that the user requesting the rejection is a master admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'admin_not_found' });
    }
    if (admin.role !== 'master') {
      return res.status(403).json({ err: 'user_role_forbidden' });
    }

    // query for the public event
    const event = await PublicEvent.findById(_id);
    if (!event) {
      return res.status(404).json({ err: 'event_not_found' });
    }

    // query for the user's public event versions
    const eventVersion = await PublicEventVersion.findOne({ userId: event.userId });
    if (!eventVersion) {
      return res.status(404).json({ err: 'event_version_not_found' });
    }

    // verify that the public event wasn't already approved
    if (eventVersion.approved.includes(_id)) {
      return res.status(400).json({ err: 'event_already_approved' });
    }

    // verify that the public event wasn't already rejected
    if (eventVersion.rejected.includes(_id)) {
      return res.status(400).json({ err: 'event_already_rejected' });
    }

    // verify that the public event is currently pending
    if (!eventVersion.pending.includes(_id)) {
      return res.status(400).json({ err: 'event_not_pending' });
    }

    // reject the event depending on the rejection type
    const pendingIndex = eventVersion.pending.findIndex(id => id === _id);
    if (pendingIndex > -1) eventVersion.pending.splice(pendingIndex, 1);
    if (type === 'hard') {
      // for a hard rejection, we straight up move it to the rejected list
      eventVersion.rejected.push(_id);

      // prepare for refunding the user
      const changes = {
        stripe: { ...event.stripe },
      };

      // proceed with the refund (if the fee was not waived)
      const feeWaived = event.stripe.amount === 0;
      if (!feeWaived) {
        const { chargeId } = event.stripe;
        const refund = await stripe.refunds.create({ charge: chargeId });
        if (refund.status !== 'succeeded') {
          return res.status(424).json({ err: refund });
        }
        changes.stripe.refunded = true;
        changes.stripe.refundId = refund.id;
      }

      // TODO: add some kind of emailer?

      // update event with refund details
      await PublicEvent.findByIdAndUpdate(_id, changes, {
        new: true,
      });
    } else {
      // for a soft rejection, we create a new document in PublicEvents with the
      // same exact parameters, minus the `_id`
      const duplicatedEvent = await duplicateEvent(event);

      // but we also reject the now old version
      eventVersion.rejected.push(_id);

      // with this duplicated event, we push it to the drafts list
      // (the user will need to make changes and submit it again for it to be not pending)
      eventVersion.drafts.push(duplicatedEvent._id);

      // and we also push the new duplicated event to the revision history list
      const refId = duplicatedEvent.masterId ? duplicatedEvent.masterId : _id;
      if (Array.isArray(eventVersion.revisions[refId])) { // just in case
        eventVersion.revisions[refId].push(duplicatedEvent._id);
      }

      // since `revisions` has the any schema type (`Schema.Types.Mixed`), mongoose
      // cannot keep track of the changes, so we have to manually tell it to update it
      eventVersion.markModified('revisions');

      // TODO: add some kind of emailer?
      // (also with rejection message support)
    }

    const updatedEventVersion = await eventVersion.save();

    return res.json(updatedEventVersion);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// updates a public event
// this is for users with the `submit_events` permission to edit their events that
// are currently have the draft, pending, or approved statuses
// if the event is a draft, no changes will be made to its status
// if the event is pending, only the date/time parameters can be updated
// if the event is approved, a duplicate will be created and will have the pending status
// due to the nature of the event versioning system, this won't affect the currently
// active version on the main public site since a duplicate will be created
// any rejected event cannot be edited
publicEventsController.update = async (req, res) => {
  const { _id, userId, changes } = req.body;

  if (!_id || !userId || !changes) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ err: 'user_not_found' });
    }

    // verify that they have the appropriate permissions to post a public event
    if (!Array.isArray(user.permissions) || !user.permissions.includes('submit_events')) {
      return res.status(403).json({ err: 'insufficient_permissions' });
    }

    // query for the public event
    const event = await PublicEvent.findById(_id);
    if (!event) {
      return res.status(404).json({ err: 'event_not_found' });
    }

    // query for the user's public event versions
    const eventVersion = await PublicEventVersion.findOne({ userId });
    if (!eventVersion) {
      return res.status(404).json({ err: 'event_version_not_found' });
    }

    // verify that the event isn't rejected
    if (eventVersion.rejected.includes(_id)) {
      return res.status(400).json({ err: 'event_already_rejected' });
    }

    // determine the event's current status
    let status;
    if (eventVersion.approved.includes(_id)) status = 'approved';
    if (eventVersion.pending.includes(_id)) status = 'pending';
    if (eventVersion.drafts.includes(_id)) status = 'drafts';
    if (!status) {
      return res.status(400).json({ err: 'undetermined_event_status' });
    }

    // continue processing based on event's status
    switch (status) {
      case 'approved': {
        // this one is the most complicated one out of the bunch --
        // we first need to duplicate the event
        const duplicatedEvent = await duplicateEvent(event);

        // then we push the duplicated event to pending
        eventVersion.pending.push(duplicatedEvent._id);

        // after, we push the duplicated event to the revision history list
        const refId = duplicatedEvent.masterId ? duplicatedEvent.masterId : _id;
        if (Array.isArray(eventVersion.revisions[refId])) {
          eventVersion.revisions[refId].push(duplicatedEvent._id.toString());
        }

        // save the changes
        eventVersion.markModified('revisions');
        await eventVersion.save();

        // finally, we update the duplicated event with the user's changes
        const updatedEvent = await PublicEvent.editLocation(duplicatedEvent._id, changes);
        return res.json(updatedEvent);
      }

      case 'pending': {
        // only let the user change the date/time information
        const parsedChanges = {};
        const eventType = changes.eventType ? changes.eventType : event.eventType;
        parsedChanges.eventType = eventType;
        if (eventType === 'unique') {
          parsedChanges.date = changes.date ? changes.date : undefined;
          parsedChanges.startTime = changes.startTime ? changes.startTime : undefined;
          parsedChanges.endTime = changes.endTime ? changes.endTime : undefined;
          parsedChanges.$unset = {
            startDate: 1,
            endDate: 1,
          };
        } else {
          parsedChanges.$unset = {
            date: 1,
            startTime: 1,
            endTime: 1,
          };
          parsedChanges.startDate = changes.startDate ? changes.startDate : undefined;
          parsedChanges.endDate = changes.endDate ? changes.endDate : undefined;
        }
        const updatedEvent = await PublicEvent.findByIdAndUpdate(_id, parsedChanges, {
          new: true,
        });
        return res.json(updatedEvent);
      }

      case 'drafts': {
        // we let them change whatever for the drafts status
        const updatedEvent = await PublicEvent.editLocation(_id, changes);
        return res.json(updatedEvent);
      }

      default: break;
    }

    // just in case, but this means ALL these checks somehow passed
    return res.status(400).json({ err: 'nothing_happened' });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// updates a public event directly
// this completely bypasses the event versioning system so any event can be edited
// also does not change the event's approval status, so therefore:
// only master admins are allowed to edit events directly
publicEventsController.adminUpdate = async (req, res) => {
  const { _id, adminId, changes } = req.body;

  if (!_id || !adminId || !changes) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // verify that the user requesting the changes is a master admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'admin_not_found' });
    }
    if (admin.role !== 'master') {
      return res.status(403).json({ err: 'user_role_forbidden' });
    }

    // proceed with the changes
    let updatedEvent;
    if (changes.location) {
      updatedEvent = await PublicEvent.editLocation(_id, changes);
    } else {
      updatedEvent = await PublicEvent.findByIdAndUpdate(_id, changes, { new: true });
    }

    return res.json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// deletes a non-member event that has been rejected and refunded
// any event that has been approved or is still pending cannot be deleted
// only master admins are allowed to delete events
// NOTE: with the introduction of event versioning, this will be temporarily unused
// until the algorithm is restructed to support this new feature
// publicEventsController.destroy = async (req, res) => {
//   const { _id, adminId } = req.body;
//
//   if (!_id || !adminId) {
//     return res.status(400).json({ err: 'missing_parameters' });
//   }
//
//   try {
//     // verify that the user requesting the deletion is a master admin
//     const admin = await User.findById(adminId);
//     if (!admin) {
//       return res.status(404).json({ err: 'admin_not_found' });
//     }
//     if (admin.role !== 'master') {
//       return res.status(403).json({ err: 'user_role_forbidden' });
//     }
//
//     // query for the public event
//     const event = await PublicEvent.findById(_id);
//     if (!event) {
//       return res.status(404).json({ err: 'event_not_found' });
//     }
//
//     // verify that the public event qualifies for deletion
//     // (leave as `event.stripe` since `stripe` is already defined above)
//     const feeWaived = event.stripe.amount === 0;
//     const canDelete = !event.approved && (
//       (feeWaived && event.stripe.refunded) ||
//       (!feeWaived && event.stripe.refunded && event.stripe.refundId)
//     );
//     if (!canDelete) {
//       return res.status(400).json({ err: 'event_not_rejected' });
//     }
//
//     // proceed with the deletion
//     const deletedEvent = await PublicEvent.findByIdAndRemove(_id);
//
//     return res.json({ _id: deletedEvent._id });
//   } catch (error) {
//     return res.status(500).json({ err: error });
//   }
// };

module.exports = publicEventsController;
