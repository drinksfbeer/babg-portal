const bcrypt = require('bcrypt-nodejs');
const base64 = require('base-64');
const PwResetToken = require('../models/pwResetToken');
const User = require('../models/user');
const uuid = require('../helpers/uuid');
const { sendResetPasswordRequestAsync } = require('../services/nodeMailer');

// how a magic link token is generated:
// user's email + uuid() + uuid() + timestamp (in ms)
// then we run it through bcrypt with a random salt generated from 10 rounds
// finally, we base64 encode it completely
const generateMagicLinkToken = (email) => {
  const rawToken = email + uuid() + uuid() + Date.now().toString();
  const salt = bcrypt.genSaltSync(); // default is 10 rounds
  const token = bcrypt.hashSync(rawToken, salt);
  const encodedToken = base64.encode(token);

  return encodedToken;
};

const pwResetTokensController = {};

pwResetTokensController.generate = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ err: 'missing_parameters' }); // 400 = Bad Request
  }

  try {
    // count number of users with the passed in email
    const numUsers = await User.countDocuments({ email });

    // there should be EXACTLY 1 user with that email, if not, respond w/ error
    if (numUsers !== 1) {
      return res.status(400).json({ err: 'user_not_found' });
    }

    // get the user's id (this should work since we verified user count before)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ err: 'user_not_found' });
    }

    // check to make sure there aren't any non-expired and unused (i.e., active) tokens
    const numNonExpiredTokens = await PwResetToken.countDocuments({
      userId: user._id,
      expires: { $gt: Date.now() },
      completed: false,
    });
    if (numNonExpiredTokens > 0) {
      return res.status(400).json({ err: 'token_currently_active' });
    }

    // generate a random magic link token
    const token = generateMagicLinkToken(email);

    // store the magic link token to the database
    const newPwResetToken = new PwResetToken({
      token,
      userId: user._id,
    });
    const savedPwResetToken = await newPwResetToken.save();
    if (!savedPwResetToken) {
      return res.status(500).json({ err: 'token_generation_error' });
    }

    // send password reset instructions to user's email
    const emailResponse = await sendResetPasswordRequestAsync({ email, token });

    return res.json({ status: 'successful' });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ err: error });
  }
};

pwResetTokensController.verify = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ err: 'missing_parameters' });
  }

  try {
    // look for the associated token
    const storedToken = await PwResetToken.findOne({ token });
    if (!storedToken) {
      return res.status(400).json({ err: 'token_not_found' });
    }

    // do some validity checking on the token
    if (Date.now() > storedToken.expires) {
      return res.status(400).json({ err: 'token_expired' });
    }
    if (storedToken.completed) {
      return res.status(400).json({ err: 'token_used' });
    }

    // now look for the user associated with this token in the database
    const user = await User.findById(storedToken.userId);
    if (!user) {
      return res.status(400).json({ err: 'user_not_found' });
    }

    // now set the `completed` state for that token to `true`
    // (if `newPassword` key is provided)
    if (newPassword) {
      storedToken.completed = true;
      await storedToken.save();
    }

    // reset the user's password (if `newPassword` key is provided)
    if (newPassword) {
      await user.setPasswordAsync(newPassword);
      await user.save();
    }

    return res.json({ status: 'successful' });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = pwResetTokensController;
