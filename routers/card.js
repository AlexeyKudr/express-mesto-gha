const express = require('express');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cardControllers');
const { createCardValid, deleteCardValid, likeCardValid } = require('../middlewars/validations');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValid, createCard);
cardRouter.delete('/:cardId', deleteCardValid, deleteCard);
cardRouter.put('/:cardId/likes', likeCardValid, likeCard);
cardRouter.delete('/:cardId/likes', likeCardValid, dislikeCard);

module.exports = cardRouter;
