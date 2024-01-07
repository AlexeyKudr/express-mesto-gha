const express = require('express');
const {
  getUsers, getUserById, updateUser, updateAvatar, currentUser,
} = require('../controllers/userControllers');
const auth = require('../middlewars/auth');
// const { updateUserValidation, updateAvatarValid } = require('../middlewars/validations');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);
userRouter.get('/me', auth, currentUser);

module.exports = userRouter;
