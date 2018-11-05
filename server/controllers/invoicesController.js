const stripe = require('../services/stripe');

const invoicesController = {};

invoicesController.index = async (req, res) => {
  try {
    const invoices = await stripe.invoices.list({
      limit: 50,
    });

    return res.json(invoices.data);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

invoicesController.create = async (req, res) => {
  const {
    email, customerId, chargeAmount, invoiceDescription, daysDue,
  } = req.body;
  const convertedAmount = parseFloat(chargeAmount) * 100;
  try {
    if (email && !customerId) {
      const customer = await stripe.customers.create({ email });
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: convertedAmount,
        currency: 'usd',
        description: invoiceDescription,
      });
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        billing: 'send_invoice',
        days_until_due: daysDue,
      });
      return res.json(invoice);
    }
    // obtain member's default funding source
    const customer = await stripe.customers.retrieve(customerId);
    const stripeDefaultSource = customer.default_source;

    await stripe.invoiceItems.create({
      customer: customerId,
      amount: convertedAmount,
      currency: 'usd',
      description: invoiceDescription,
    });
    const invoice = await stripe.invoices.create({
      customer: customerId,
      billing: 'send_invoice',
      days_until_due: daysDue,
    });

    // set `cardId` as `default_source` in Stripe
    await stripe.customers.update(customerId, {
      default_source: stripeDefaultSource,
    });
    return res.json(invoice);
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = invoicesController;
