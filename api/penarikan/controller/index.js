const { getMunfiqByKodeTabungDB } = require('../../munfiq/controller/queries');
const {
  beforeUpdateRekapDB,
  updateCurrentRekapDB,
  afterUpdatePenarikanDB,
} = require('../../rekap/controller/queries');
const {
  createPenarikanDB,
  totalPenarikanDB,
  getAllPenarikanDB,
  updatePenarikanByIdDB,
  getPenarikanTerbaruDB,
  getDetailPenarikanDB,
} = require('./queries');

module.exports = {
  checkStatusPenarikan: async (req, res) => {
    let statusCode;
    try {
      const kode_tabung = req.query.kode_tabung.toUpperCase();

      if (!kode_tabung) {
        statusCode = 400;
        throw new Error('error');
      }

      const check = await beforeUpdateRekapDB(kode_tabung);
      const munfiq = await getMunfiqByKodeTabungDB(kode_tabung);

      if (!munfiq) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      } else if (typeof check === 'undefined' || !check) {
        statusCode = 409;
        throw new Error('conflict');
      }

      return res.status(200).json({ data: { message: 'OK' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  addPenarikan: async (req, res) => {
    let statusCode;

    try {
      const nominal = parseInt(req.body.nominal);
      const id_munfiq = parseInt(req.body.id_munfiq);
      const id_kec = parseInt(req.body.id_kec);
      const id_user = parseInt(req.body.id_user);
      const kode_tabung = req.query.kode_tabung.toUpperCase();

      if (
        id_kec < 0 ||
        id_munfiq < 0 ||
        id_user < 0 ||
        !id_kec ||
        !id_munfiq ||
        !id_user ||
        !kode_tabung
      ) {
        statusCode = 409;
        throw new Error('error');
      } else if (nominal < 1 || !nominal) {
        statusCode = 400;
        throw new Error('invalid');
      }

      const check = await beforeUpdateRekapDB(kode_tabung);
      const munfiq = await getMunfiqByKodeTabungDB(kode_tabung);

      if (typeof check === 'undefined' || !check) {
        statusCode = 409;
        throw new Error('conflict');
      } else if (!munfiq) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      await createPenarikanDB(nominal, kode_tabung, id_munfiq, id_kec, id_user);
      await updateCurrentRekapDB(nominal, id_user, check.id_rekap);

      return res.status(201).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getAllPenarikan: async (req, res) => {
    let statusCode;

    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await totalPenarikanDB(search);
      const totalPages = Math.ceil(totalRows.total / limit);
      const result = await getAllPenarikanDB(search, limit, offset);

      if (!result) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({
        data: { message: 'success', result, page, limit, totalRows: totalRows.total, totalPages },
      });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getDetailPenarikan: async (req, res) => {
    let statusCode;

    try {
      const id_penarikan = parseInt(req.params.id_penarikan);

      if (id_penarikan < 1 || !id_penarikan) {
        statusCode = 409;
        throw new Error('error');
      }

      const penarikan = await getDetailPenarikanDB(id_penarikan);

      return res.status(200).json({ data: { message: 'success', result: penarikan } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getPenarikanTerbaru: async (req, res) => {
    let statusCode;
    try {
      const penarikan = await getPenarikanTerbaruDB();

      if (!penarikan) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan');
      }

      return res.status(200).json({ data: { message: 'success', result: penarikan } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  updatePenarikan: async (req, res) => {
    let statusCode;

    try {
      const nominal = parseInt(req.body.nominal);
      const id_penarikan = parseInt(req.params.id_penarikan);
      const kode_tabung = req.query.kode_tabung;
      const tgl_tarik = req.body.tgl_tarik;

      const date = new Date(tgl_tarik);

      const month = date.toLocaleDateString('en-US', { month: 'long' });
      const year = date.getFullYear();

      if (id_penarikan < 0 || !id_penarikan) {
        statusCode = 409;
        throw new Error('error');
      } else if (nominal < 0 || !nominal || !kode_tabung) {
        statusCode = 400;
        throw new Error('invalid');
      }

      await updatePenarikanByIdDB(nominal, id_penarikan);
      await afterUpdatePenarikanDB(month, year, nominal, kode_tabung);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
