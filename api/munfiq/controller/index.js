const { getKecByIdDB } = require('../../kecamatan/controller/queries');
const {
  totalMunfiqDB,
  getAllMunfiqDB,
  createMunfiqDB,
  getMunfiqByIdDB,
  updateMunfiqByIdDB,
  deleteMunfiqByIdDB,
  generateKodeTabungDB,
  getMunfiqByKodeTabungDB,
} = require('./queries');

module.exports = {
  addMunfiq: async (req, res) => {
    let statusCode;

    try {
      const { fullname, no_tlp, alamat, kelurahan } = req.body;
      const id_kec = parseInt(req.body.id_kec);

      if (!fullname || !id_kec) {
        statusCode = 400;
        throw new Error('Data harus lengkap.');
      } else if (id_kec < 1) {
        statusCode = 409;
        throw new Error('error');
      }

      const kecamatan = await getKecByIdDB(id_kec);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Kecamatan tidak ditemukan.');
      }

      const kode_tabung = await generateKodeTabungDB(id_kec);

      if (!kode_tabung) {
        throw new Error('Kode tabung error.');
      }

      await createMunfiqDB(fullname, no_tlp, alamat, kode_tabung, id_kec, kelurahan);

      return res.status(201).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getAllMunfiq: async (req, res) => {
    let statusCode;

    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = page * limit;
      const totalRows = await totalMunfiqDB(search);
      const totalPages = Math.ceil(totalRows.total / limit);
      const result = await getAllMunfiqDB(search, limit, offset);

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
  getDetailMunfiq: async (req, res) => {
    let statusCode;

    try {
      const id_munfiq = parseInt(req.params.id_munfiq);

      if (id_munfiq < 0 || !id_munfiq) {
        statusCode = 409;
        throw new Error('error');
      }

      const munfiq = await getMunfiqByIdDB(id_munfiq);

      if (!munfiq) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({ data: { message: 'success', result: munfiq } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getMunfiqByKodeTabung: async (req, res) => {
    let statusCode;

    try {
      const kode_tabung = req.query.kode_tabung.toUpperCase();

      if (typeof kode_tabung !== 'string' || !kode_tabung) {
        statusCode = 400;
        throw new Error('error');
      }

      const munfiq = await getMunfiqByKodeTabungDB(kode_tabung);

      if (!munfiq) {
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({ data: { message: 'success', result: munfiq } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  updateMunfiq: async (req, res) => {
    let statusCode;

    try {
      const { fullname, no_tlp, alamat, kelurahan } = req.body;
      const id_kec = parseInt(req.body.id_kec);
      const id_munfiq = parseInt(req.params.id_munfiq);

      if (!fullname || !id_kec) {
        statusCode = 400;
        throw new Error('Data harus lengkap');
      } else if (id_kec < 1 || id_munfiq < 1) {
        statusCode = 409;
        throw new Error('error');
      }

      const munfiq = await getMunfiqByIdDB(id_munfiq);

      if (!munfiq) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      const kecamatan = await getKecByIdDB(id_kec);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Kecamatan tidak ditemukan.');
      }

      await updateMunfiqByIdDB(fullname, no_tlp, alamat, id_kec, kelurahan, id_munfiq);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  deleteMunfiq: async (req, res) => {
    let statusCode;

    try {
      const id_munfiq = parseInt(req.params.id_munfiq);

      if (id_munfiq < 1 || !id_munfiq) {
        statusCode = 409;
        throw new Error('error');
      }

      const munfiq = await getMunfiqByIdDB(id_munfiq);

      if (!munfiq) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      await deleteMunfiqByIdDB(id_munfiq);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
