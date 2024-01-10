const express = require('express');
const {
  getUsers, getUserById, updateUser, updateAvatar, currentUser,
} = require('../controllers/userControllers');
// const auth = require('../middlewars/auth');
const { userByIdValid, updateUserValid, updateAvatarValid } = require('../middlewars/validations');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/me', currentUser);
userRouter.get('/:userId', userByIdValid, getUserById);
userRouter.patch('/me', updateUserValid, updateUser);
userRouter.patch('/me/avatar', updateAvatarValid, updateAvatar);

module.exports = userRouter;
