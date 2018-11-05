const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Member = require('./member');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true },
  hasRegistered: { type: Boolean, default: false },
  hasBeenInvited: { type: Boolean, default: false },
  salt: { type: String },
  role: {
    type: String,
    enum: [
      'master',
      'chapter',
      'member',
      'staff',
      'agent',
      'enthusiast',
    ],
    required: true,
  },
  chapterUuid: { type: String }, // required if role === chapter
  memberUuid: { type: String }, // required if role === member
  permissions: [{
    type: String,
    enum: [
      'forum',
      'blog',
      'events',
      'subscription',
      'voting',
      'submit_events',
      'events_free',
      'sponsor',
    ],
  }], // applies to member roles
  sponsorId: { type: String }, // agent's assigned sponsor
  created: { type: Number, default: Date.now() },

  // if `role` is `agent`
  stripeCustomerId: { type: String },
  stripeCards: [{
    cardId: String,
    brand: String,
    lastFour: String,
  }],
  company: {
    name: { type: String },
    image: { type: String },
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.setPassword = function createPassword(candidatePassword, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    this.salt = salt;
    if (!candidatePassword) {
      return callback(null, this);
    }
    bcrypt.hash(candidatePassword, salt, null, (err, hash) => {
      this.password = hash;
      if (err) {
        console.log(err); // eslint-disable-line
        return callback(err);
      }
      return callback(null, this);
    });
  });
};

UserSchema.methods.setPasswordAsync = function createPasswordAsync(candidatePassword) {
  return new Promise((resolve, reject) => this.setPassword(candidatePassword, (err, user) => {
    if (err) return reject(err);
    resolve(user);
  }));
};

UserSchema.methods.authorize = function checkPassword(candidatePassword, callback) {
  if (!candidatePassword) {
    console.log('no candidate password'); // eslint-disable-line
    return callback(new Error('No Password Provided'));
  }
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      console.log('Error occured comparing hashpass with rawpass'); // eslint-disable-line
      console.log(err); // eslint-disable-line
      return callback(err);
    }
    // console.log(isMatch); // eslint-disable-line
    isMatch ? callback(null, this) : callback(new Error('Incorrect Password'));
  });
};

// this is meant to give the master user's a member to use to create events.
UserSchema.methods.populateOrCreateMasterMember = async function populateOrCreateCB(callback) {
  if (this.role === 'master') {
    let masterMember;
    masterMember = await Member
      .findOne({ bayAreaMasterMember: true })
      .populate('locations');

    if (!masterMember) {
      const newMember = new Member({
        chapterUuid: 'none',
        name: 'Bay Area Brewers Guild',
        image: 'https://i.imgur.com/aIltyVJ.jpg',
        bayAreaMasterMember: true,
      });
      masterMember = await newMember.save();
    }
    const populatedUser = {
      ...this._doc,
      member: {
        locations: [],
        ...masterMember.toObject(),
      },
    };
    callback(populatedUser);
  } else {
    callback(this);
    // eslint-disable-next-line
    console.warn('This function should not be run on a non master');
  }
};

UserSchema.virtual('member', {
  ref: 'member',
  localField: 'memberUuid',
  foreignField: 'uuid',
  justOne: true,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('user', UserSchema);

// new User({
//   email: 'agent@paradeigm.com',
//   role: 'agent',
// }).setPassword('password', (err, newUser) => {
//   newUser.save(console.log)
// })
// new User({
//   email: 'master@paradeigm.com',
//   role: 'master',
// }).setPassword('password', (err, newUser) => {
//   newUser.save(console.log)
// })
// new User({
//   email: 'chapter@paradeigm.com',
//   role: 'chapter',
// }).setPassword('password', (err, newUser) => {
//   newUser.save(console.log)
// })
// new User({
//   email: 'member@paradeigm.com',
//   role: 'member',
// }).setPassword('password', (err, newUser) => {
//   newUser.save(console.log)
// })

module.exports = User;
