const { Conflict } = require('../utils/const');
const BadRequestError = require('./BadRequestError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const UnAuthorized = require('./Unauthorized');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const errors = (error, req, res, next) => {
  // Обработка ошибок валидации Joi
  if (error && error.isJoi) {
    return res.status(400).json({
      message: 'Ошибка валидации данных',
      errors: error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  // Обработка ошибки дублирования email
  if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
    return res
      .status(Conflict)
      .json({ message: 'Этот email уже используется' });
  }

  // Обработка неверного токена
  if (error.name === 'JsonWebTokenError') {
    return res
      .status(UnAuthorized)
      .json({ message: 'Некорректный токен' });
  }

  // Обработка кастомных ошибок
  if (error instanceof BadRequestError) {
    return res.status(error.status || 500).json({ message: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(error.status || 500).json({ message: error.message });
  }
  if (error instanceof UnAuthorized) {
    return res.status(error.status || 500).json({ message: error.message });
  }
  if (error instanceof ForbiddenError) {
    return res.status(error.status || 500).json({ message: error.message });
  }

  // По умолчанию возвращаем 500 ошибку
  return res
    .status(500)
    .json({ message: error.message || 'Ошибка по умолчанию' });
};

module.exports = errors;
