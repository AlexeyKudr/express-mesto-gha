const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: {
      value: true,
      message: 'Поле email является обязательным',
    },
    validate: {
      validator: validator.isEmail,
      message: 'Неправильно введен email',
    },
  },
  password: {
    type: String,
    select: false,
    require: {
      value: true,
      message: 'Поле password является обязательным',
    },
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: (props) => `${props.value} неверный формат url`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
