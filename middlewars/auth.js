/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const UnAuthorized = require('./Unauthorized');

const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : null;
  if (!token) {
    return next(new UnAuthorized('Требуется авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'secret_key');
  } catch (error) {
    next(new UnAuthorized('Неверный токен'));
  }
  req.user = payload;
  next();
};

module.exports = auth;
