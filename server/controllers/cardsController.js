const Member = require('../models/member');
const User = require('../models/user');
const stripe = require('../services/stripe');

const cardsController = {};

cardsController.create = async (req, res) => {
  const { memberId, card } = req.body;

  if (!memberId || !card) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  const {
    cardNumber,
    cardExpiry,
    cardCVC,
    cardZip,
  } = card;

  if (!cardNumber || !cardExpiry || !cardCVC || !cardZip) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  const [expMonth, expYear] = cardExpiry.split(' / ');

  try {
    // get customer token attached to member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(400).json({ err: 'member_not_found' });
    }

    // check if member is a Stripe customer yet
    const changes = {};
    if (!member.stripeCustomerId) {
      const customer = await stripe.customers.create({ email: member.email });
      if (!customer) {
        return res.status(424).json({ err: 'customer_creation_failed' });
      }
      changes.stripeCustomerId = customer.id;
    }

    const stripeCustomerId = member.stripeCustomerId || changes.stripeCustomerId;

    // generate Stripe card token
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber.split(' ').join(''),
        exp_month: parseInt(expMonth, 10),
        exp_year: parseInt(expYear, 10),
        cvc: cardCVC,
        address_zip: cardZip,
      },
    });

    // attach card token to customer and get card ID
    const cardSource = await stripe.customers.createSource(
      stripeCustomerId,
      { source: cardToken.id },
    );
    const {
      id: cardId,
      brand,
      last4: lastFour,
    } = cardSource;

    // add card to list of member's cards
    const options = {
      runValidators: true,
      new: true,
    };
    if (member.stripeCards && Array.isArray(member.stripeCards)) {
      changes.stripeCards = JSON.parse(JSON.stringify(member.stripeCards)); // deep-copy
    } else {
      changes.stripeCards = [];
    }
    changes.stripeCards.push({
      cardId,
      brand,
      lastFour,
    });

    // obtain member's default funding source
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    changes.stripeDefaultSource = customer.default_source || '';

    // save changes to member
    const response = await Member
      .findByIdAndUpdate(memberId, changes, options)
      .populate('chapter')
      .populate('locations');

    return res.json(response);
  } catch (error) {
    // console.log('Caught exception:', error); // eslint-disable-line
    return res.status(500).json({ err: error });
  }
};

cardsController.setDefault = async (req, res) => {
  const { memberId, cardId } = req.body;

  if (!memberId || !cardId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // get member's list of cards
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(400).json({ err: 'member_not_found' });
    }
    const { stripeCustomerId, stripeCards } = member;

    // verify that `cardId` is one of member's cards
    const cardIndex = stripeCards.findIndex(card => card.cardId === cardId);
    if (cardIndex < 0) {
      return res.status(400).json({ err: 'card_not_found' });
    }

    // set `cardId` as `default_source` in Stripe
    const updatedCustomer = await stripe.customers.update(stripeCustomerId, {
      default_source: cardId,
    });

    // update member's default funding source
    const changes = {
      stripeDefaultSource: updatedCustomer.default_source || '',
    };
    const options = {
      runValidators: true,
      new: true,
    };

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

cardsController.destroy = async (req, res) => {
  const {
    memberId,
    cardId,
    isAgent = false,
  } = req.body;

  if (!memberId || !cardId) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // get member's list of cards
    let stripeCustomerId;
    let stripeCards;
    if (isAgent) {
      const agent = await User.findById(memberId);
      if (!agent || agent.role !== 'agent') {
        return res.status(404).json({ err: 'agent_not_found' });
      }
      ({ stripeCustomerId, stripeCards } = agent);
    } else {
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ err: 'member_not_found' });
      }
      ({ stripeCustomerId, stripeCards } = member);
    }

    // verify that `cardId` is one of member's cards
    const cardIndex = stripeCards.findIndex(card => card.cardId === cardId);
    if (cardIndex < 0) {
      return res.status(400).json({ err: 'card_not_found' });
    }

    // remove card from Stripe
    const deleteResponse = await stripe.customers.deleteCard(
      stripeCustomerId,
      stripeCards[cardIndex].cardId,
    );
    if (!deleteResponse.deleted) {
      return res.status(500).json({ err: 'card_delete_failed' });
    }

    // remove card from array in member's list of cards
    const changes = {};
    const options = {
      runValidators: true,
      new: true,
    };
    changes.stripeCards = JSON.parse(JSON.stringify(stripeCards)); // deep-copy
    changes.stripeCards.splice(cardIndex, 1);

    // obtain member's default funding source
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    changes.stripeDefaultSource = customer.default_source || '';

    // save changes to member
    let response;
    if (isAgent) {
      response = await User.findByIdAndUpdate(memberId, changes, options);
    } else {
      response = await Member
        .findByIdAndUpdate(memberId, changes, options)
        .populate('chapter')
        .populate('locations');
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = cardsController;
