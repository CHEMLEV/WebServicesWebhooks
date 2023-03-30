const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
    email: {required: true, unique: true, type: String},
    password: {required: true, type: String}
  });

const User = mongoose.model('User', userSchema);


module.exports = User;