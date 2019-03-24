const errors = require('restify-errors');
const jwt = require('jsonwebtoken');
const auth = require('../auth');
const config = require('../config');

module.exports = {
  create: (req, res, next) => {
    const { email, password } = req.body;
    auth.authenticate(email, password)
      .then((user) => {
        // Create JWT
        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
          expiresIn: '24hours',
        });

        const { iat, exp } = jwt.decode(token);
        // Respond with token
        res.send({ iat, exp, token });
        return next();
      })
      .catch(err => next(new errors.UnauthorizedError(err)));
  },
};
