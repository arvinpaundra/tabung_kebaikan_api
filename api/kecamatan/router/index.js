const { isAdmin, isUserLogin } = require('../../../middlewares/auth');
const { getRekapKecamatan } = require('../../rekap/controller');
const {
  addKecamatan,
  getAllKecamatan,
  getSingleKecamatan,
  updateKecamatan,
  deleteKecamatan,
} = require('../controller');

const router = require('express').Router();

router.get('/', getAllKecamatan);
router.post('/tambah', isUserLogin, isAdmin, addKecamatan);
router.get('/:id_kec', getSingleKecamatan);
router.get('/:id_kec/rekap', getRekapKecamatan);
router.put('/:id_kec/edit', isUserLogin, isAdmin, updateKecamatan);
router.delete('/:id_kec/delete', isUserLogin, isAdmin, deleteKecamatan);

module.exports = router;
