const card = require("../models/card");
const mongoose = require('mongoose');

const getCards = async (req, res) => {
  try {
    const cards = await card.find({});
    res
    .status(200)
    .json({ data: cards });
  } catch (error) {
    if (error.name === "SomeErrorName") {
      return res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
    }
return res
.status(500)
.send({message: 'Ошибка по умолчанию'});
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const newCard = await card.create({ name, link, owner });
    res.status(201).send(newCard);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(400).send({ message: "Переданы некорректные данные", error: error.message });
      default:
        return res.status(500).send({ message: "Ошибка по умолчанию"});
    }
  }
}

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).send({ message: "Некорректный формат ID карточки" });
    }
    const Card = await card.findByIdAndDelete(cardId);
    if (!Card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    }
    res.status(200).send({ message: "Карточка удалена" });
  } catch (err) {
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
};

const likeCard = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return res.status(400).send({ message: "Передан невалидный _id карточки" });
    }
    const Card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!Card) {
      return res.status(404).send({ message: "Передан несуществующий _id карточки" });
    }
    res.status(200).send(Card);
  } catch (error) {
    res.status(500).send({ message: "Ошибка по умолчанию" });
  }
};


const dislikeCard = async (req, res) => {
  try {
    const Card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!Card) {
      return res
      .status(404)
      .send({ message: "Передан несуществующий _id карточки" });
    }
    res
    .status(200)
    .send(Card);
  } catch (err) {
    res
    .status(500)
    .send({ message: "Ошибка по умолчанию" });
  }
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };