const User = require('../models/user');
const Member = require('../models/member');
const stripe = require('../services/stripe');

const plansController = {};

// retrieve a list of all current plans
plansController.index = async (req, res) => {
  try {
    const plans = await stripe.plans.list({
      product: process.env.STRIPE_PRODUCT,
    });

    return res.json(plans.data);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// retrieve a list of member's subscriptions
plansController.detail = async (req, res) => {
  const { memberIds } = req.body;

  if (!memberIds || !Array.isArray(memberIds) || memberIds.length < 1) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  const stripeCustomers = {}; // key is the `member._id`, value is the Stripe customer id
  const output = [];

  try {
    // first, fetch all the Stripe customer ids for all the requested members
    const members = await Member.find({
      _id: { $in: memberIds },
    });
    if (members.length < 1) {
      return res.status(400).json({ err: 'members_not_found' });
    }

    for (const member of members) {
      if (member.stripeCustomerId) {
        stripeCustomers[member._id] = member.stripeCustomerId;
      }
    }

    for (const memberId in stripeCustomers) {
      const stripeCustomerId = stripeCustomers[memberId];
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      const subscription = {};

      // check to make sure the customer even has a subscription
      if (customer.subscriptions && Array.isArray(customer.subscriptions.data)) {
        // skip current memeber iteration if they don't
        // (we want to minimize how many bytes we send over in the response payload)
        if (customer.subscriptions.data.length < 1) continue;

        const item = customer.subscriptions.data[0];
        subscription.id = item.id; // subscription id
        subscription.itemId = item.items.data[0].id; // subscription item id
        subscription.billing = item.billing;
        subscription.created = item.created * 1000; // convert to ms
        subscription.currentPeriodStart = item.current_period_start * 1000;
        subscription.currentPeriodEnd = item.current_period_end * 1000;
        subscription.discount = item.discount; // `null` if no coupon was applied
        subscription.daysUntilDue = item.days_until_due;
        subscription.status = item.status;
      }

      output.push({
        memberId,
        stripeCustomerId,
        subscription,
      });
    }

    return res.json({ details: output });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// create a new monthly subscription plan
// the amount cannot be changed once created
plansController.create = async (req, res) => {
  const { nickname, amount, interval } = req.body;
  const currency = 'usd';

  if (!nickname || !amount || !interval) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const plan = await stripe.plans.create({
      amount,
      interval,
      product: process.env.STRIPE_PRODUCT,
      currency,
      nickname,
    });

    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// change the name and active status of a subscription
plansController.update = async (req, res) => {
  const { id, nickname, active } = req.body;

  if (!id || !nickname || typeof active === 'undefined') {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const updatedPlan = await stripe.plans.update(id, {
      nickname,
      active: active === 'true' || active === true,
    });

    return res.json(updatedPlan);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

// assigns a member to a subscription
// if member has a previous subscription, this will replace it with the new one
// the payment amount will automatically be prorated by Stripe
// if the subscription has a coupon, it will still be applied!
plansController.assign = async (req, res) => {
  const { memberId, planId } = req.body;

  if (!memberId || !planId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(400).json({ err: 'member_not_found' });
    }
    const { stripeCustomerId, stripeSubscriptionId } = member;
    const changes = {};
    const options = {
      runValidators: true,
      new: true,
    };

    // member has an existing subscription, so replace associated plan with new one
    // member will be prorated for the old and new plans
    if (stripeSubscriptionId) {
      // get subscription item (`si_...`) id from `stripeSubscriptionId`
      const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const subscriptionItemId = subscription.items.data[0].id;

      // update subscription item with new `planId`
      // `stripeSubscriptionId` remains the same
      await stripe.subscriptionItems.update(subscriptionItemId, {
        plan: planId,
        prorate: true,
      });
      changes.stripePlanId = planId;
    } else { // member has no existing subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [
          { plan: planId },
        ],
      });
      changes.stripePlanId = planId;
      changes.stripeSubscriptionId = subscription.id;
    }

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

// cancels a member's subscription
// all pending invoices will still go through
// all unpaid invoices will be canceled
// subscription will still exist in the db, so it can still be assigned to other members
plansController.resign = async (req, res) => {
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(400).json({ err: 'member_not_found' });
    }
    const { stripeCustomerId, stripeSubscriptionId } = member;
    const changes = {};
    const options = {
      runValidators: true,
      new: true,
    };

    if (!stripeSubscriptionId) {
      return res.status(400).json({ err: 'subscription_not_found' });
    }

    // cancel member's subscription
    await stripe.subscriptions.del(stripeSubscriptionId);
    changes.stripePlanId = null;
    changes.stripeSubscriptionId = null;

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

// deletes a plan
// all currently subscribed members will be removed from this plan and be
// automatically refunded their prorated amounts
plansController.destroy = async (req, res) => {
  const { adminId, planId } = req.body;

  if (!adminId || !planId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // first, verify that `adminId` is actually a master admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ err: 'user_not_found' });
    }
    const { role } = admin;
    if (!role || role !== 'master') {
      return res.status(403).json({ err: 'user_role_invalid' });
    }

    // then, find all the members subscribed to the plan and remove them from it
    // Stripe will automatically refund them their prorated amounts
    const members = await Member.find({ stripePlanId: planId });
    for (const member of members) {
      await stripe.subscriptions.del(member.stripeSubscriptionId);
      member.stripeSubscriptionId = null;
      member.stripeCouponId = null;
      member.stripePlanId = null;
      await member.save();
    }

    // finally, delete the plan from Stripe
    const deletedPlan = await stripe.plans.del(planId);
    if (!deletedPlan || !deletedPlan.deleted) {
      return res.status(424).json({ err: 'plan_deletion_failed' });
    }
    return res.json(deletedPlan);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = plansController;
