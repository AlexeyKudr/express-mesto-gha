const { celebrate, Joi } = require('celebrate');

const urlReg = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)#?$/;

const loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const createUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlReg),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const userByIdValid = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required()
      .messages({
        'string.length': 'Некорректный ID пользователя',
        'any.required': 'ID пользователя обязателен',
      }),
  }),
});

const updateUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlReg),
  }),
});

const createCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlReg),
  }),
});

module.exports = {
  loginValid,
  createUserValid,
  userByIdValid,
  updateUserValid,
  updateAvatarValid,
  createCardValid,
};
