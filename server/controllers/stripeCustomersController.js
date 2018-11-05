const stripe = require('../services/stripe');

const stripeCustomersController = {};

stripeCustomersController.index = async (req, res) => {
  try {
    const customers = await stripe.customers.list({
      limit: 1000,
    });

    return res.json(customers.data);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = stripeCustomersController;
