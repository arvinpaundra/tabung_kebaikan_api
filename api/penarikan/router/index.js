const { isAdmin, isUserLogin } = require('../../../middlewares/auth');
const {
  addPenarikan,
  checkStatusPenarikan,
  getAllPenarikan,
  updatePenarikan,
} = require('../controller');

const router = require('express').Router();

router.post('/?', isUserLogin, addPenarikan);
router.get('/?', isUserLogin, getAllPenarikan);
router.get('/check?', isUserLogin, checkStatusPenarikan);
router.put('/:id_penarikan/edit', isUserLogin, isAdmin, updatePenarikan);

module.exports = router;
