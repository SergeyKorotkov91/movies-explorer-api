const router = require('express').Router();
const { getUser, updateProfile } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');

router.get('/me', getUser);
router.patch('/me', validationUpdateUser, updateProfile);

module.exports = router;