const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers');

const app = express();
const PORT = 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6586a97952d463ec6c5836f7',
  };

  next();
});

app.use(router);

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(PORT, () => {
});
