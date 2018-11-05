const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema({
  type: {
    type: String,
    enum: ['brewery', 'event', 'location'],
    required: true,
  },
  tag: {
    type: String,
    required: true,
    enum: ['modified', 'new', 'deactivated'],
  },
  body: { type: String, required: true },
  title: { type: String, required: true },
  itemId: { type: String, required: true },
  memberUuid: { type: String, required: true },
  image: { type: String },
  created: { type: Number, default: Date.now },
});

NotificationSchema.virtual('member', {
  ref: 'member',
  localField: 'memberUuid',
  foreignField: 'uuid',
  justOne: true,
});
NotificationSchema.set('toObject', { virtuals: true });
NotificationSchema.set('toJSON', { virtuals: true });

const Notification = mongoose.model('notification', NotificationSchema);

module.exports = Notification;
