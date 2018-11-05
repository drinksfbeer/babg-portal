const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');

const { Schema } = mongoose;

const SubmissionSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    default: uuidv1,
  },
  formUuid: {
    type: String,
    required: true,
  },
  results: Schema.Types.Mixed,
  created: { type: Number, default: Date.now },
}, {
  id: false,
});


SubmissionSchema.virtual('form', {
  ref: 'form',
  localField: 'formUuid',
  foreignField: 'uuid',
  justOne: true,
});
SubmissionSchema.set('toObject', { virtuals: true });
SubmissionSchema.set('toJSON', { virtuals: true });

const Form = mongoose.model('submission', SubmissionSchema);

module.exports = Form;
