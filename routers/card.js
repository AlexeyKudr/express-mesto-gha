const express = require('express');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cardControllers');
const { createCardValid } = require('../middlewars/validations');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValid, createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
