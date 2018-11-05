const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
const uuidv1 = require('uuid/v1');
const URLSlugs = require('mongoose-url-slugs');

const { Schema } = mongoose;

const MemberSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: uuidv1,
  },
  chapterUuid: {
    type: String,
    required: true,
  },

  // info
  name: {
    type: String,
    required: true,
    trim: true,
    // unique: true,  TODO need to fix
  },
  tagline: { type: String },
  description: { type: String },
  licenseCode: { type: String },

  // assets
  image: { type: String, required: true },
  bannerImage: { type: String },
  video: { type: String },

  // links
  website: { type: String },
  email: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },

  // facts
  foundingDate: { type: String },
  annualBarrelage: { type: String },
  founders: { type: String },
  contactEmail: { type: String },
  assets: [{
    assetType: { type: String, required: true },
    url: { type: String, required: true },
    name: { type: String },
    created: { type: Number, default: Date.now },
  }],

  // referenceIds
  untappdId: { type: String },

  // when bayAreaMasterMember is true, it's associated with master USERS.
  // when the guild posts events, it comes through this member.
  bayAreaMasterMember: { type: Boolean },
  created: { type: Number, default: Date.now },

  // stripe stuff
  stripeCustomerId: { type: String, required: false },
  stripePlanId: { type: String, required: false },
  stripeSubscriptionId: { type: String, required: false },
  stripeDefaultSource: { type: String },
  stripeCards: [{
    cardId: String,
    brand: String,
    lastFour: String,
    primary: Boolean,
  }],
  stripeCouponId: {
    type: String,
    required: false,
  },
}, {
  id: false,
});

MemberSchema.plugin(URLSlugs('name'));
MemberSchema.virtual('chapter', {
  ref: 'chapter',
  localField: 'chapterUuid',
  foreignField: 'uuid',
  justOne: true,
});
MemberSchema.virtual('locations', {
  ref: 'location',
  localField: 'uuid',
  foreignField: 'memberUuid',
});
MemberSchema.set('toObject', { virtuals: true });
MemberSchema.set('toJSON', { virtuals: true });

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
