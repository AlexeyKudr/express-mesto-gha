const express = require('express');
const userRouter = require('./user');
const cardRouter = require('./card');
const { login, createUser } = require('../controllers/userControllers');
const auth = require('../middlewars/auth');
const NotFoundError = require('../middlewars/NotFoundError');
const { loginValid, createUserValid } = require('../middlewars/validations');

const router = express.Router();

router.post('/signin', loginValid, login);
router.post('/signup', createUserValid, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
