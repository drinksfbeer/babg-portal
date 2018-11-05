const mongoose = require('mongoose');

const { Schema } = mongoose;

const SettingsSchema = new Schema({
  festivalStartDate: { type: Number },
  festivalEndDate: { type: Number },
  defaultEventBannerImage: { type: String },
  publicEventEnabled: { type: Boolean },
  publicEventUniqueFee: { type: Number },
  publicEventWeekLongFee: { type: Number },
  publicEventUniqueMaxTime: { type: Number },
  publicEventNotice: { type: String },
  publicEventClosedTitle: { type: String },
  publicEventClosedText: { type: String },
});

const Settings = mongoose.model('settings', SettingsSchema);

module.exports = Settings;
