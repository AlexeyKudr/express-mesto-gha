const mongoose = require('mongoose');
const card = require('../models/card');
const {
  HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, OK, HTTP_NOT_FOUND,
} = require('../utils/const');

const getCards = async (req, res) => {
  try {
    const cards = await card.find({});
    res
      .status(OK)
      .json({ data: cards });
  } catch (error) {
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const newCard = await card.create({ name, link, owner });
    return res.status(OK).send(newCard);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(HTTP_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      default:
        return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HTTP_BAD_REQUEST).send({ message: 'Некорректный формат ID карточки' });
    }
    const Card = await card.findByIdAndDelete(cardId);
    if (!Card) {
      return res.status(HTTP_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.status(OK).send({ message: 'Карточка удалена' });
  } catch (err) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return res.status(HTTP_BAD_REQUEST).send({ message: 'Передан невалидный _id карточки' });
    }
    const Card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!Card) {
      return res.status(HTTP_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.status(OK).send(Card);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const Card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!Card) {
      return res
        .status(HTTP_NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки' });
    }
    return res
      .status(OK)
      .send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(HTTP_BAD_REQUEST)
        .send({ message: 'Указан некорректный _id карточки' });
    }
    return res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
