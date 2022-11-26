const router = require('express').Router();
const {
  validateUserInfo,
  // validateUserId
} = require('../middlewares/validation');

const {
  // findUserbyId,
  updateUser,
  getUserInfo,
} = require('../controllers/users');

router.get('/users/me', getUserInfo);
// router.get('/users/:id', validateUserId, findUserbyId);
router.patch('/users/me', validateUserInfo, updateUser);

module.exports = router;
