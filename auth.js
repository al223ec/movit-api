const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const errors = require('restify-errors');

const User = mongoose.model('User');

exports.authenticate = (email, password) => new Promise((resolve, reject) => {
  User.findOne({ email })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return reject(err);
        }

        if (!isMatch) {
          return reject(new errors.UnauthorizedError('Authentication Failed'));
        }

        return resolve(user);
      });
    })
    .catch(reject);
});
