const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../utils/const');

const auth = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer', '')
    : null;
  if (!token) {
    return res
      .status(Unauthorized)
      .send({ message: 'Вы не авторизированы' });
  }
  let payload;
  try {
    payload = jwt.verify(token, 'secret_key');
  } catch (error) {
    return res
      .status(Unauthorized)
      .send({message: 'Вы не авторизированы' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
