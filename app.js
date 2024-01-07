const express = require('express');
const mongoose = require('mongoose');
const { celebrate } = require('celebrate');
const router = require('./routers');
const errors = require('./middlewars/errors');

const app = express();
const PORT = 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

app.use(express.json());

app.use(router);
app.use(celebrate());
app.use(errors);
app.use((req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
});
