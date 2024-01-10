const mongoose = require('mongoose');
const card = require('../models/card');
const { OK } = require('../utils/const');
const BadRequestError = require('../middlewars/BadRequestError');
const NotFoundError = require('../middlewars/NotFoundError');
const ForbiddenError = require('../middlewars/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await card.find({});
    res
      .status(OK)
      .json({ data: cards });
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const newCard = await card.create({ name, link, owner });
    return res.status(OK).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return card.findById(cardId)
    .then((Card) => {
      if (!Card) {
        throw new NotFoundError('Карточка не найдена.');
      } else if (Card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для удаления');
      }
      return card.findByIdAndDelete(cardId)
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки'));
      }
      next(error);
    });
};

const likeCard = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return next(new BadRequestError('Некорректный ID карточки'));
    }
    const Card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!Card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res.status(OK).send(Card);
  } catch (error) {
    return next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const Card = await card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!Card) {
      return next(new NotFoundError('Карточка не найдена'));
    }
    return res
      .status(OK)
      .send(Card);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
