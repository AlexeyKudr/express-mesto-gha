const express = require('express');
const userRouter = require('./user');
const cardRouter = require('./card');

const router = express.Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
