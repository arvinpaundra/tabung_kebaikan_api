const { isAdmin, isUserLogin } = require('../../../middlewares/auth');
const {
  addPenarikan,
  checkStatusPenarikan,
  getAllPenarikan,
  updatePenarikan,
  getPenarikanTerbaru,
  getDetailPenarikan,
} = require('../controller');

const router = require('express').Router();

router.post('/?', isUserLogin, addPenarikan);
router.get('/?', isUserLogin, getAllPenarikan);
router.get('/latest', isUserLogin, getPenarikanTerbaru);
router.get('/check?', isUserLogin, checkStatusPenarikan);
router.get('/:id_penarikan', isUserLogin, getDetailPenarikan);
router.put('/:id_penarikan/edit?', isUserLogin, isAdmin, updatePenarikan);

module.exports = router;
