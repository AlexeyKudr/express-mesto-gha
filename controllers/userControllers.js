const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const {
  HTTP_NOT_FOUND, OK, MONGO_DUPLICATE_ERROR_CODE,
} = require('../utils/const');
const BadRequestError = require('../middlewars/BadRequestError');
const DuplicateError = require('../middlewars/DuplicateError');
const UnAuthorized = require('../middlewars/Unauthorized');
const NotFoundError = require('../middlewars/NotFoundError');
const generateJwtToken = require('../utils/generateJwt');

const getUsers = async (req, res, next) => {
  try {
    const Users = await user.find({});
    res
      .status(OK)
      .send(Users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const User = await user.findById(userId);
    if (!User) {
      return res.status(HTTP_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Некорректный ID пользователя');
    }
    return res.status(OK).send(User);
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = await user.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    });
    return res
      .status(201)
      .send({
        email: newUser.email,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
      });
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new DuplicateError('Такой email уже существует'));
    }
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const UpdateUser = await user.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).orFail(new Error('Запрашиваемый пользователь не найден'));
    return res
      .status(OK)
      .json(UpdateUser);
  } catch (error) {
    return next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const UpdateUser = await user.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ).orFail(new Error('Запрашиваемый пользователь не найден'));
    return res
      .status(OK)
      .json(UpdateUser);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const User = await user.findOne({ email }).select('+password');
    if (!User) {
      throw new UnAuthorized('Неверные почта или пароль');
    }
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      throw new UnAuthorized('Неверные почта или пароль');
    }
    const token = generateJwtToken({
      _id: User._id,
    });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    });
    return res
      .status(OK)
      .send({ data: { email: User.email, id: User._id } });
  } catch (error) {
    return next(error);
  }
};

// eslint-disable-next-line consistent-return
const currentUser = async (req, res, next) => {
  try {
    const User = await user.findById(req.user._id).orFail(() => next(new NotFoundError('Пользователя не найден')));
    res.send(User);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login, currentUser,
};
