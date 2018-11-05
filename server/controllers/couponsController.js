const Member = require('../models/member');
const stripe = require('../services/stripe');

const couponsController = {};

couponsController.index = async (req, res) => {
  try {
    const coupons = await stripe.coupons.list();

    return res.json(coupons.data);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

couponsController.create = async (req, res) => {
  const {
    id,
    percentOff,
    duration,
    numMonths,
  } = req.body;

  if (!id || !percentOff || !duration || !numMonths) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const coupon = await stripe.coupons.create({
      id,
      percent_off: parseInt(percentOff, 10),
      duration,
      duration_in_months: duration === 'repeating' ? numMonths : null,
    });

    return res.json(coupon);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// applies a coupon to a member's subscription
couponsController.apply = async (req, res) => {
  const { memberId, couponId } = req.body;

  if (!memberId || !couponId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // get member's Stripe subscription id
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(400).json({ err: 'member_not_found' });
    }
    const { stripeSubscriptionId } = member;
    if (!stripeSubscriptionId) {
      return res.status(400).json({ err: 'subscription_not_found' });
    }
    const changes = {};
    const options = {
      runValidators: true,
      new: true,
    };

    const subscription = await stripe.subscriptions.update(stripeSubscriptionId, {
      coupon: couponId || null,
    });
    changes.stripeCouponId = couponId;

    // save changes to member
    const response = await Member
      .findByIdAndUpdate(memberId, changes, options)
      .populate('chapter')
      .populate('locations');

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// removes a coupon from all subscriptions to which it is applied to
// the coupon will still be applied for the current billing cycle, but will be removed on the next
// effective immediately, the coupon cannot be applied to any more subscriptions
couponsController.destroy = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.json(400).json({ err: 'missing_parameters' });
  }

  try {
    // find all members with this coupon id and remove them all
    // also store all of their subscription ids so we can remove them from Stripe after
    const members = await Member.find({ stripeCouponId: id });
    const subscriptionIds = [];
    for (const member of members) {
      member.stripeCouponId = null;
      subscriptionIds.push(member.stripeSubscriptionId);
      await member.save();
    }

    // remove coupon from Stripe
    const removedCoupon = await stripe.coupons.del(id);

    // remove coupon from subscriptions that currently have them applied in Stripe
    for (const subscriptionId of subscriptionIds) {
      await stripe.subscriptions.update(subscriptionId, { coupon: null });
    }

    return res.json(removedCoupon);
  } catch (error) {
    return res.json(500).json({ err: error });
  }
};

module.exports = couponsController;
