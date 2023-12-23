const user = require("../models/user");
const mongoose = require('mongoose');

const getUsers= async (req, res) => {
  try {
    const users = await user.find({});
    return res
    .send(users);
  } catch (error) {
    if (err.name === "SomeErrorName") {
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
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
    .status(400)
    .send({ message: "Некорректный ID пользователя" });
  }
  try {
    const user = await user.findById(userId);
    if (!user) {
      return res
      .status(404)
      .send({ message: "Пользователь не найден" });
    }
    res
    .status(200)
    .json(user);
  } catch (err) {
    res
    .status(500)
    .send({ message: "Ошибка по умолчанию" });
  }
}

const createUser = async (req, res) => {
  try {
    const newUser = await user.create(req.body);
    return res
    .status(201)
    .send(newUser);
  } catch (err) {
    if (err.name === "SomeErrorName") {
      return res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
    }
    return res
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
  } catch (err) {
    if (err.name === "SomeErrorName") {
      return res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
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
  } catch (err) {
    if (err.name === "SomeErrorName") {
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
