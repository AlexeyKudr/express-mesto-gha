const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const generateJwtToken = (payload) => {
  const token = jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'secret_key', {
    expiresIn: '7d',
  });

  return token;
};

module.exports = generateJwtToken;
