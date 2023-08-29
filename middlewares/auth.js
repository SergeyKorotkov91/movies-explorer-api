const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const { JWT_SECRET = 'strong-secret-key' } = process.env;

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new AuthError('Сначала авторизируйтесь');
  }

  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Требуется авторизация');
  }

  req.user = payload;

  next();
};

module.exports = auth;
