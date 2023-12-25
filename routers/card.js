const express = require('express');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cardControllers');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;