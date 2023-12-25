const mongoose = require('mongoose');
const user = require('../models/user');
const {
  HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND, OK,
} = require('../utils/const');

const getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    res
      .status(OK)
      .send(users);
  } catch (error) {
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = await user.findById(userId);
    if (!User) {
      return res.status(HTTP_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    return res.status(OK).send(User);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(HTTP_BAD_REQUEST).send({ message: 'Передан не валидный Id' });
    }
    return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await user.create(req.body);
    return res
      .status(201)
      .send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
          .status(HTTP_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      default:
        return res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const UpdateUser = await user.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!UpdateUser) {
      return res
        .status(HTTP_NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }
    return res
      .status(OK)
      .json(UpdateUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
          .status(HTTP_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные', error: error.message });
      default:
        return res
          .status(HTTP_INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const UpdateUser = await user.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );
    if (!UpdateUser) {
      return res
        .status(HTTP_NOT_FOUND)
        .send({ message: 'Пользователь не найден' });
    }
    return res
      .status(OK)
      .json(UpdateUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(HTTP_BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные' });
    }
    return res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
