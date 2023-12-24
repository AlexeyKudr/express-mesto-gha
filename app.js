const express = require('express');
const mongoose = require('mongoose');
const router = require('./routers');

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> {
  console.log('Подключено');
})
.catch((err) => {
  console.log('Ошибка', err.message);
})

app.use(express.json())

app.use((req, res, next) => {
  req.user = {
    _id: '6586a97952d463ec6c5836f7'
  };

  next();
});

app.use(router)


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});