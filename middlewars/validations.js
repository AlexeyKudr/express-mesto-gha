const { joi } = require('celebrate');

const urlAvatarValid = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)#?$/;

const createUserValid = joi.object({
  name: joi.string().min(2).max(30),
  about: joi.string().min(2).max(30),
  avatar: joi.string().pattern(urlAvatarValid).message('Неправильный URL аватара'),
  email: joi.string().required().email(),
  password: joi.string().required().min(8),
});

const updateAvatarValid = joi.object({
  avatar: joi.string().pattern(urlAvatarValid).message('Неправильный URL аватара'),
});

const updateUserValidation = joi.object({
  name: joi.string().min(2).max(30),
  about: joi.string().min(2).max(30),
});

module.exports = {
  createUserValid,
  updateUserValidation,
  updateAvatarValid,
};
