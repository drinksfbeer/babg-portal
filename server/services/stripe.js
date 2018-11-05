const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET);

module.exports = stripe;
