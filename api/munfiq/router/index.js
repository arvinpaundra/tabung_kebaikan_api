const { isUserLogin, isAdmin } = require('../../../middlewares/auth');
const {
  getAllMunfiq,
  addMunfiq,
  getDetailMunfiq,
  updateMunfiq,
  deleteMunfiq,
  getMunfiqByKodeTabung,
} = require('../controller');

const router = require('express').Router();

router.get('/', isUserLogin, getAllMunfiq);
router.post('/tambah', isUserLogin, addMunfiq);
router.get('/check?', isUserLogin, getMunfiqByKodeTabung);
router.get('/:id_munfiq', isUserLogin, getDetailMunfiq);
router.put('/:id_munfiq/edit', isUserLogin, isAdmin, updateMunfiq);
router.delete('/:id_munfiq/delete', isUserLogin, isAdmin, deleteMunfiq);

module.exports = router;
