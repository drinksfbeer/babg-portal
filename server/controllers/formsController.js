const Form = require('../models/form');
const crud = require('./default/crud');

const formsController = crud(Form);

formsController.index = (req, res) => {
  const { query } = req;
  Form
    .find(query)
    .sort({ created: -1 })
    .select('-__v')
    .then(foundForms => res.json(foundForms))
    .catch(error => res.status(400).json({ error }));
};

formsController.show = (req, res) => {
  const { id } = req.params;
  // here is where you can check for public or private forms
  // for front end if private, route to /login?redirect=${the url}
  // onLogin then route back to the form with the localStorage updated

  Form.findOne({ uuid: id }, (err, foundItem) => {
    if (err) {
      console.log('Error occurred find resource', err);
      return res.status(400).json({ err });
    }
    res.json(foundItem);
  });
};

module.exports = formsController;
