const { getKecByIdDB } = require('../../kecamatan/controller/queries');
const {
  createKelurahanDB,
  getTotalKelurahanDB,
  getAllKelurahanDB,
  getKelurahanByIdDB,
  updateKelurahanByIdDB,
  deleteKelurahanByIdDB,
} = require('./queries');

module.exports = {
  addKelurahan: async (req, res) => {
    let statusCode;

    try {
      const { nama_kel, id_kec } = req.body;

      if (!nama_kel) {
        statusCode = 400;
        throw new Error('Data harus lengkap.');
      } else if (id_kec < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const kecamatan = await getKecByIdDB(id_kec);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Kecamatan tidak tersedia.');
      }

      await createKelurahanDB(nama_kel, id_kec);

      return res.status(201).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getAllKelurahan: async (req, res) => {
    let statusCode;

    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await getTotalKelurahanDB(search);
      const totalPages = Math.ceil(totalRows.total / limit);
      const result = await getAllKelurahanDB(search, limit, offset);

      if (result.length < 1) {
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
  getDetailKelurahan: async (req, res) => {
    let statusCode;

    try {
      const { id_kel } = req.params;

      if (id_kel < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const kelurahan = await getKelurahanByIdDB(id_kel);

      if (!kelurahan) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({ data: { message: 'success', result: kelurahan } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  updateKelurahan: async (req, res) => {
    let statusCode;

    try {
      const { nama_kel, id_kec } = req.body;
      const { id_kel } = req.params;

      if (!nama_kel) {
        statusCode = 400;
        throw new Error('Data harus lengkap.');
      } else if (id_kec < 1 || !id_kel) {
        statusCode = 400;
        throw new Error('error');
      }

      const kecamatan = await getKecByIdDB(id_kec);
      const kelurahan = await getKelurahanByIdDB(id_kel);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Kecamatan tidak tersedia.');
      } else if (!kelurahan) {
        statusCode = 404;
        throw new Error('Kelurahan tidak tersedia.');
      }

      await updateKelurahanByIdDB(nama_kel, id_kec, id_kel);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  deleteKelurahan: async (req, res) => {
    let statusCode;

    try {
      const { id_kel } = req.params;

      if (id_kel < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const kelurahan = await getKelurahanByIdDB(id_kel);

      if (!kelurahan) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      await deleteKelurahanByIdDB(id_kel);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
