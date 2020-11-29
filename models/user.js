const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

const UserScheme = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = module.exports = mongoose.model('User', UserScheme);

module.exports.getUserByLogin = (login, callback) => {
  const query = { login };
  User.findOne(query, callback);
};
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};
module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;

      newUser = { ...newUser, password: hash };
      newUser.save(callback);
    });
  });
};
module.exports.comparePass = (passFromUser, userPass, callback) => {
  bcrypt.compare(passFromUser, userPass, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};