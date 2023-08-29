const router = require('express').Router();
const cookieParser = require('cookie-parser');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundErrors');
const {
  login,
  createUser,
  logout,
} = require('../controllers/users');
const { validationCreateUser, validationLogin } = require('../middlewares/validations');

router.post('/signup', validationCreateUser, createUser);
router.use(cookieParser());
router.post('/signin', validationLogin, login);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.get('/signout', logout);

router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

module.exports = router;