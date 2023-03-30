const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }

});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;