const express = require('express');
const userRouter = require('./user');
const cardRouter = require('./card');
const { login, createUser } = require('../controllers/userControllers');
const auth = require('../middlewars/auth');

const router = express.Router();

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
