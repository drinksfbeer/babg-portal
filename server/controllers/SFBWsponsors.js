const SFBWsponsors = require('../models/SFBWsponsors');
const crud = require('./default/crud');

const SFBWsponsorsController = crud(SFBWsponsors);

module.exports = SFBWsponsorsController;
