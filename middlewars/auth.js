/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnAuthorized = require('./Unauthorized');

const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnAuthorized('Необходима авторизация');
    }
    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, 'secret_key');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new UnAuthorized('С токеном что-то не так'));
    }
    return next(error);
  }
  req.user = payload;
  next();
};

module.exports = auth;
