const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');
const URLSlugs = require('mongoose-url-slugs');

const { Schema } = mongoose;

const FormSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: uuidv1,
  },
  name: { type: String, required: true },
  sections: [{
    fieldType: { type: String, required: true },
    question: { type: String },
    options: { type: String },
    required: { type: Boolean },
  }],
  visibility: {
    type: String,
    enum: ['public', 'members'],
    default: 'public',
  },
}, {
  id: false,
});

FormSchema.plugin(URLSlugs('name'));

FormSchema.virtual('submissions', {
  ref: 'submission',
  localField: 'uuid',
  foreignField: 'formUuid',
});
FormSchema.set('toObject', { virtuals: true });
FormSchema.set('toJSON', { virtuals: true });

const Form = mongoose.model('form', FormSchema);

module.exports = Form;
