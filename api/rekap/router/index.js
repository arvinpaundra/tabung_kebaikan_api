const { isAdmin, isUserLogin } = require('../../../middlewares/auth');
const {
  getAllRekap,
  getRekapByStatus,
  getRekapByKecamatan,
  getAllRekapPerbulan,
  getTotalSaldo,
} = require('../controller');

const router = require('express').Router();

router.get('/?', isUserLogin, isAdmin, getAllRekap);
router.get('/total-saldo', getTotalSaldo);
router.get('/data-rekap?', getAllRekapPerbulan);
router.get('/by-status?', isUserLogin, getRekapByStatus);
router.get('/by-kecamatan?', isUserLogin, getRekapByKecamatan);

module.exports = router;
