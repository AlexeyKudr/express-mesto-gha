const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Поле name является обязательным',
    },
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: {
      value: true,
      message: 'Поле link является обязательным',
    },
    validate: {
      validator: (link) => validator.isURL(link),
      message: (props) => `${props.value} неверный формат ссылки`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: {
      value: true,
      message: 'Поле owner является обязательным',
    },
    ref: 'user',
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
