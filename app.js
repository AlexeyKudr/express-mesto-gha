const express = require('express');
const mongoose = require('mongoose');
const { errors: celebrateErrors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routers');
// const errors = require('./middlewars/errors');
const { HTTP_NOT_FOUND } = require('./utils/const');

const app = express();
const PORT = 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(celebrateErrors());
app.use('*', (req, res) => {
  res.status(HTTP_NOT_FOUND).send({ message: 'Страница не найдена' });
});
app.use((error, req, res, next) => {
  // Отправка ответа клиенту
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Что-то пошло не так',
    },
  });
});

app.listen(PORT, () => {
});
