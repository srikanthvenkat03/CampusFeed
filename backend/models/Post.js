const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  rsvp: {
    going: {
      type: Number,
      default: 0
    },
    maybe: {
      type: Number,
      default: 0
    },
    notGoing: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: 'Posts'
});

module.exports = mongoose.model('Post', postSchema);
