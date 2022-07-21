const { isAdmin, isUserLogin } = require('../../../middlewares/auth');
const {
  addKecamatan,
  getAllKecamatan,
  getSingleKecamatan,
  updateKecamatan,
  deleteKecamatan,
} = require('../controller');

const router = require('express').Router();

router.post('/', isUserLogin, isAdmin, addKecamatan);
router.get('/', getAllKecamatan);
router.get('/:id_kec', getSingleKecamatan);
router.put('/:id_kec/edit', isUserLogin, isAdmin, updateKecamatan);
router.delete('/:id_kec/delete', isUserLogin, isAdmin, deleteKecamatan);

module.exports = router;
