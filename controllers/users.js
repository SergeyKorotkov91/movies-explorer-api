const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundErrors');
const AuthError = require('../errors/authError');
const DuplicationError = require('../errors/dataDuplication');
const BadRequest = require('../errors/badRequest');

const { JWT_SECRET = 'strong-secret-key' } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.status(201)
          .send({
            name, email,
          }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new DuplicationError('Пользователь с таким Email уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequest('Невалидные данные'));
          } else {
            next(err);
          }
        });
    }).catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          res.status(200).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: none,
            secure: true
          });
          return res.send({ _id: user._id });
        })
        .catch(next);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.user;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.send({ message: 'Выход выполнен' });
  } catch (err) {
    return next(err);
  }
};

const returnUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const returnUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const { id } = req.user;

  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true, upsert: false })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Невалидные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  returnUsers,
  returnUserById,
  updateProfile,
  logout,
  login,
  getUser,
};
