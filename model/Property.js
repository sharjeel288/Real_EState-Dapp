const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  price: {
    type: Number,
    required: true,
  },
  tokenId: {
    type: Number,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  offers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      offerValue: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model('property', propertySchema);
