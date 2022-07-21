const {
  addKelurahan,
  getAllKelurahan,
  getDetailKelurahan,
  updateKelurahan,
  deleteKelurahan,
} = require('../controller');

const router = require('express').Router();

router.post('/', addKelurahan);
router.get('/', getAllKelurahan);
router.get('/:id_kel', getDetailKelurahan);
router.put('/:id_kel/edit', updateKelurahan);
router.delete('/:id_kel/delete', deleteKelurahan);

module.exports = router;
