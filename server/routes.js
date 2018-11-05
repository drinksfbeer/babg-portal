const services = require('./controllers/servicesController');
const users = require('./controllers/usersController');
const pwResetTokens = require('./controllers/pwResetTokensController');
const chapters = require('./controllers/chaptersController');
const members = require('./controllers/membersController');
const locations = require('./controllers/locationsController');
const events = require('./controllers/eventsController');
const pages = require('./controllers/pagesController');
const notifications = require('./controllers/notificationsController');
const announcements = require('./controllers/announcementsController');
const forms = require('./controllers/formsController');
const submissions = require('./controllers/submissionsController');
const plans = require('./controllers/plansController');
const coupons = require('./controllers/couponsController');
const cards = require('./controllers/cardsController');
const blogPosts = require('./controllers/blogPostController');
const invoices = require('./controllers/invoicesController');
const customers = require('./controllers/stripeCustomersController');
const SFBWpages = require('./controllers/SFBWpageController');
const itineraries = require('./controllers/itinerariesController');
const settings = require('./controllers/settingsController');
const SFBWsponsors = require('./controllers/SFBWsponsors');
const publicEvents = require('./controllers/publicEventsController');

module.exports = (app) => {
  app.get('/api/v1/settings', settings.index);
  app.post('/api/v1/settings', settings.create);
  app.put('/api/v1/settings', settings.update);
  app.delete('/api/v1/settings', settings.destroy);

  app.get('/api/v1/SFBWsponsors', SFBWsponsors.index);
  app.post('/api/v1/SFBWsponsors', SFBWsponsors.create);
  app.put('/api/v1/SFBWsponsors', SFBWsponsors.update);
  app.delete('/api/v1/SFBWsponsors', SFBWsponsors.destroy);

  app.post('/api/v1/contactGuild', services.publicContactForm);
  app.post('/api/v1/googleDetails', services.getGoogleDetails);

  app.get('/api/v1/invoices', invoices.index);
  app.post('/api/v1/invoices', invoices.create);

  app.get('/api/v1/customers', customers.index);

  app.get('/api/v1/token', users.token);
  app.post('/api/v1/auth', users.authorize);
  app.get('/api/v1/users', users.index);
  app.post('/api/v1/users', users.create);
  app.put('/api/v1/users', users.update);
  app.delete('/api/v1/users', users.destroy);
  app.post('/api/v1/users-invite', users.invite);
  app.post('/api/v1/users-register', users.register);
  app.post('/api/v1/registerAgent', users.registerAgent);

  app.post('/api/v1/users/forgot', pwResetTokens.generate);
  app.post('/api/v1/users/verify', pwResetTokens.verify);

  app.get('/api/v1/plans', plans.index);
  app.post('/api/v1/plans', plans.create);
  app.put('/api/v1/plans', plans.update);
  app.delete('/api/v1/plans', plans.destroy);
  app.post('/api/v1/plans-detail', plans.detail);
  // app.put('/api/v1/plans-assign', plans.updateMember);
  app.put('/api/v1/plans-assign', plans.assign);
  app.put('/api/v1/plans-resign', plans.resign);
  // app.put('/api/v1/plans-update-payment', plans.updatePayment);
  // app.get('/api/v1/plans-retrieve-payment', plans.retrievePayment);

  app.get('/api/v1/coupons', coupons.index);
  app.post('/api/v1/coupons', coupons.create);
  app.put('/api/v1/coupons-assign', coupons.apply);
  app.delete('/api/v1/coupons', coupons.destroy);

  app.post('/api/v1/cards', cards.create);
  app.put('/api/v1/cards-default', cards.setDefault);
  app.delete('/api/v1/cards', cards.destroy);

  app.post('/api/v1/image', services.imageUpload);
  app.post('/api/v1/event-image', services.eventImageUpload);

  app.get('/api/v1/geocode', services.geocodeStuff);

  app.get('/api/v1/chapters', chapters.index);
  app.post('/api/v1/chapters', chapters.create);
  app.put('/api/v1/chapters', chapters.update);
  app.delete('/api/v1/chapters', chapters.destroy);

  app.get('/api/v1/members', members.index);
  app.post('/api/v1/members', members.create);
  app.put('/api/v1/members', members.update);
  app.delete('/api/v1/members', members.destroy);

  app.get('/api/v1/locations', locations.index);
  app.post('/api/v1/locations', locations.create);
  app.put('/api/v1/locations', locations.update);
  app.delete('/api/v1/locations', locations.destroy);

  app.get('/api/v1/events', events.index);
  app.post('/api/v1/events', events.create);
  app.put('/api/v1/events', events.update);
  app.delete('/api/v1/events', events.destroy);

  app.get('/api/v1/publicEvents', publicEvents.index);
  app.get('/api/v1/publicEvents/version', publicEvents.versionIndex);
  app.get('/api/v1/publicEvents-active', publicEvents.activeIndex);
  app.get('/api/v1/publicEvents-all', publicEvents.allIndex);
  app.get('/api/v1/publicEvents-all/version', publicEvents.allVersionIndex);
  app.post('/api/v1/publicEvents', publicEvents.create);
  app.put('/api/v1/publicEvents/approve', publicEvents.approve);
  app.put('/api/v1/publicEvents/reject', publicEvents.reject);
  app.put('/api/v1/publicEvents', publicEvents.update);
  app.put('/api/v1/publicEvents-admin', publicEvents.adminUpdate);
  // app.delete('/api/v1/publicEvents', publicEvents.destroy);

  app.get('/api/v1/SFBWpages', SFBWpages.index);
  app.post('/api/v1/SFBWpages', SFBWpages.create);
  app.put('/api/v1/SFBWpages', SFBWpages.update);
  app.delete('/api/v1/SFBWpages', SFBWpages.destroy);

  app.get('/api/v1/pages', pages.index);
  app.post('/api/v1/pages', pages.create);
  app.put('/api/v1/pages', pages.update);
  app.delete('/api/v1/pages', pages.destroy);

  app.get('/api/v1/blogPosts', blogPosts.index);
  app.post('/api/v1/blogPosts', blogPosts.create);
  app.put('/api/v1/blogPosts', blogPosts.update);
  app.delete('/api/v1/blogPosts', blogPosts.destroy);

  app.get('/api/v1/notifications', notifications.index);
  app.post('/api/v1/notifications', notifications.create);
  app.put('/api/v1/notifications', notifications.update);
  app.delete('/api/v1/notifications', notifications.destroy);

  app.get('/api/v1/announcements', announcements.index);
  app.post('/api/v1/announcements', announcements.create);
  app.put('/api/v1/announcements', announcements.update);
  app.delete('/api/v1/announcements', announcements.destroy);

  app.get('/api/v1/forms', forms.index);
  app.post('/api/v1/forms', forms.create);
  app.get('/api/v1/forms/:id', forms.show);
  app.put('/api/v1/forms', forms.update);
  app.delete('/api/v1/forms', forms.destroy);

  app.get('/api/v1/submissions', submissions.index);
  app.get('/api/v1/submissions-export', submissions.export);
  app.post('/api/v1/submissions', submissions.create);
  app.put('/api/v1/submissions', submissions.update);
  app.delete('/api/v1/submissions', submissions.destroy);

  app.get('/api/v1/itineraries', itineraries.index);
  app.put('/api/v1/itineraries', itineraries.update);
};
