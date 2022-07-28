const {
  getAllPetugas,
  getDetailPetugas,
  updatePetugas,
  deletePetugas,
  getPenarikanPetugas,
  getDetailUser,
} = require('../controller');

const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const { isUserLogin, isAdmin } = require('../../../middlewares/auth');
const { getRekapPetugas } = require('../../rekap/controller');
const { changePasswordUser, resetPassword, addPetugas } = require('../../auth/controller');

router.get('/', isUserLogin, isAdmin, getAllPetugas);
router.post('/tambah', isUserLogin, isAdmin, addPetugas);
router.get('/username/:username', isUserLogin, getDetailPetugas);
router.get('/id/:id_user', isUserLogin, getDetailUser);
router.get('/:id_user/penarikan?', isUserLogin, getPenarikanPetugas);
router.get('/:id_user/rekap', isUserLogin, getRekapPetugas);
router.put(
  '/:id_user/edit',
  isUserLogin,
  multer({ dest: os.tmpdir() }).single('profile_picture'),
  updatePetugas,
);
router.put('/:id_user/reset-password?', isUserLogin, isAdmin, resetPassword);
router.put('/:id_user/change-password?', isUserLogin, changePasswordUser);
router.delete('/:id_user/delete', isUserLogin, isAdmin, deletePetugas);

module.exports = router;
