const { isAdmin, isUserLogin } = require('../../../middlewares/auth');
const {
  getAllRekap,
  getRekapByStatus,
  getRekapByKecamatan,
  getTotalNominalPenarikan,
  getTotalNominalKecamatan,
  getTotalNominalPetugas,
} = require('../controller');

const router = require('express').Router();

router.get('/?', isUserLogin, isAdmin, getAllRekap);
router.get('/by-status?', isUserLogin, getRekapByStatus);
router.get('/by-kecamatan?', isUserLogin, getRekapByKecamatan);
router.get('/total?', getTotalNominalPenarikan);
router.get('/total/kecamatan/:id_kec?', getTotalNominalKecamatan);
router.get('/total/petugas/:id_user?', isUserLogin, getTotalNominalPetugas);

module.exports = router;
