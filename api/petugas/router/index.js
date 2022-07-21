const {
  getAllPetugas,
  getDetailPetugas,
  updatePetugas,
  deletePetugas,
  getPenarikanPetugas,
} = require('../controller');

const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const { isUserLogin, isAdmin } = require('../../../middlewares/auth');

router.get('/', isUserLogin, isAdmin, getAllPetugas);
router.get('/:id_user', isUserLogin, getDetailPetugas);
router.get('/:id_user/penarikan?', isUserLogin, getPenarikanPetugas);
router.put(
  '/:id_user/edit',
  isUserLogin,
  multer({ dest: os.tmpdir() }).single('profile_picture'),
  updatePetugas,
);
router.delete('/:id_user/delete', isUserLogin, isAdmin, deletePetugas);

module.exports = router;
