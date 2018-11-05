const nodemailer = require('nodemailer');
const inviteTemplate = require('./emailTemplates/invite');
const contactTemplate = require('./emailTemplates/contact');
const resetPasswordTemplate = require('./emailTemplates/resetPassword');

const hostname = process.env.NODE_ENV === 'development' ?
  'http://localhost:3002' : 'http://members.bayareabrewersguild.floc.beer';

const emailConfig = {
  service: 'Gmail',
  auth: {
    user: 'jm@drinksfbeer.com',
    pass: '',
  },
};

const transporter = nodemailer.createTransport(emailConfig);

const sendInvite = ({ email }, callback) => {
  const url = `${hostname}/register?email=${email}`;
  const html = inviteTemplate(url, email);

  transporter.sendMail({
    from: emailConfig.auth.user,
    to: email,
    subject: 'You\'ve been invited to join the Bay Area Brewers Guild',
    html,
  }, callback);
};

const contactForm = (message, email, first, last, toEmail) => {
  const html = contactTemplate(message, email, first, last);
  transporter.sendMail({
    from: emailConfig.auth.user,
    to: toEmail,
    subject: 'Public Contact Form',
    html,
  });
};

const sendResetPasswordRequest = ({ email, token }, callback) => {
  const url = `${hostname}/forgot?token=${token}`;
  const html = resetPasswordTemplate(url);
  transporter.sendMail({
    from: emailConfig.auth.user,
    to: email,
    subject: 'Bay Area Brewers Guild Password Reset Request',
    html,
  }, callback);
};

const sendResetPasswordRequestAsync = params => new Promise(resolve =>
  sendResetPasswordRequest(params, resolve));

module.exports = {
  sendInvite,
  contactForm,
  sendResetPasswordRequest,
  sendResetPasswordRequestAsync,
};
