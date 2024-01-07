const express = require('express');
const {
  getUsers, getUserById, updateUser, updateAvatar, currentUser,
} = require('../controllers/userControllers');
const auth = require('../middlewars/auth');
const { userByIdValid, updateUserValid } = require('../middlewars/validations');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', userByIdValid, getUserById);
userRouter.patch('/me', updateUserValid, updateUser);
userRouter.patch('/me/avatar', updateUserValid, updateAvatar);
userRouter.get('/me', auth, currentUser);

module.exports = userRouter;
