const user = require("../models/user");

const { NotFoundError } = require("../utils/NotFoundError");

const getUsers= async (req, res) => {
  try {
    const users = await user.find({});
    return res
    .send(users);
  } catch (error) {
    if (error.name === "SomeErrorName") {
      return res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
    }
return res
.status(500)
.send({message: 'Ошибка по умолчанию'});
  }
}

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = await user.findById(userId).orFail(
      () => new NotFoundError('Пользователь не найден'));
    return res
    .status(200).send(User);
  } catch (error) {
    switch (error.name) {
      case 'CastError':
        return res
       .status(404)
       .send({ message: "Передан не валидный Id" });
       case "NotFoundError":
        return res
        .status(error.statusCode).send({message: error.message})
      default:
        return res
        .status(500)
        .send({ message: "Ошибка по умолчанию" });
    }
  }
}

const createUser = async (req, res) => {
  try {
    const newUser = await user.create(req.body);
    res
    .status(201)
    .send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
        .status(400)
        .send({ message: "Переданы некорректные данные", error: error.message });
    }
    res
    .status(500)
    .send({ message: "Ошибка по умолчанию" });
  }
}

const updateUser = async (req, res) => {
  try {
    const updateUser = await user.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updateUser) {
      return res
        .status(404)
        .send({ message: "Пользователь не найден" });
    }
    res
    .status(200)
    .json(updateUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res
        .status(400)
        .send({ message: "Переданы некорректные данные", error: error.message });
    }
    res
    .status(500)
    .send({ message: "Ошибка по умолчанию" });
  }
}

const updateAvatar = async (req, res) => {
  try {
    const updateUser = await user.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true }
    );
    if (!updateUser) {
      return res
        .status(404)
        .send({ message: "Пользователь не найден" });
    }
    res
    .status(200)
    .json(updateUser);
  } catch (error) {
    if (error.name === "SomeErrorName") {
      return res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
    }
    res
    .status(500)
    .send({ message: "Ошибка по умолчанию" });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, updateAvatar };
