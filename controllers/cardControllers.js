const card = require("../models/card");

const getCards = async (req, res) => {
  try {
    const cards = await card.find({});
    res
    .status(200)
    .json({ data: cards });
  } catch (error) {
    if (err.name === "SomeErrorName") {
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
    const card = await card.create({ name, link, owner });
    res
    .status(201)
    .json(card);
  } catch (err) {
    if (err.name === "SomeErrorName") {
      res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
    } else {
      res
      .status(500)
      .send({ message: "Ошибка по-умолчанию" });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      return res
      .status(404)
      .send({ message: "Карточка не найдена" });
    }
    res
    .status(200)
    .send({ message: "Карточка удалена" });
  } catch (err) {
    res
    .status(500)
    .send({ message: "Ошибка по-умолчанию" });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    res
    .status(200)
    .json(card);
    if (!card) {
      return res
      .status(404)
      .send({ message: "Передан несуществующий _id карточки" });
    }
  } catch (err) {
    res
    .status(500)
    .send({ message: "Ошибка по-умолчанию" });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    res
    .status(200)
    .json(card);
    if (!card) {
      return res
      .status(404)
      .send({ message: "Передан несуществующий _id карточки" });
    }
  } catch (err) {
    res
    .status(500)
    .send({ message: "Ошибка по-умолчанию" });
  }
};

module.exports = { getCards,createCard, deleteCard, likeCard, dislikeCard };