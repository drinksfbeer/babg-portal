const Member = require('../models/member');
const crud = require('./default/crud');
const stripe = require('../services/stripe');

const membersController = crud(Member);

membersController.index = async (req, res) => {
  const { query } = req;

  try {
    const members = await Member
      .find(query)
      .populate('chapter')
      .populate('locations');
    const validMembers = members.filter(member => member.chapter);

    return res.json(validMembers);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

membersController.update = async (req, res) => {
  const { _id, changes } = req.body;

  if (!_id || !changes) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  const options = {
    runValidators: true,
    new: true,
  };

  try {
    // find the member
    const member = await Member.findById(_id);
    if (!member) {
      return res.status(404).json({ err: 'member_not_found' });
    }

    // check if email was updated and if so, update it in Stripe
    if (member.stripeCustomerId && changes.email) {
      await stripe.customers.update(member.stripeCustomerId, { email: changes.email });
    }

    const updatedMember = await Member
      .findByIdAndUpdate(_id, changes, options)
      .populate('chapter')
      .populate('locations');
    return res.json(updatedMember);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

membersController.create = async (req, res) => {
  const { pkg } = req.body;

  if (!pkg) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  const member = new Member(pkg);

  try {
    // create a new Stripe customer
    const customer = await stripe.customers.create({ email: member.email });
    if (!customer) {
      return res.status(424).json({ err: 'customer_creation_failed' });
    }

    // attach Stripe customer id to member
    member.stripeCustomerId = customer.id;

    // save member to database
    const newMember = await member.save();

    // return newly created member
    const response = await newMember
      .populate('locations')
      .populate('chapter');
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

membersController.destroy = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // first, obtain the member's Stripe customer id
    const member = await Member.findById(_id);
    if (!member) {
      return res.status(404).json({ err: 'member_not_found' });
    }
    const { stripeCustomerId } = member;

    // then, delete attached customer id from Stripe
    if (stripeCustomerId) {
      const deletedCustomer = await stripe.customers.del(stripeCustomerId);
      if (!deletedCustomer.deleted) {
        return res.status(424).json({ err: 'customer_deletion_failed' });
      }
    }

    // then, delete the actual member from the db
    const deletedMember = await Member.findByIdAndRemove(_id);
    if (!deletedMember) {
      return res.status(400).json({ err: 'member_deletion_failed' });
    }

    return res.json({ _id: deletedMember._id });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = membersController;
