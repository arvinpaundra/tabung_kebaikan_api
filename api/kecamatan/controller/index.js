const {
  createKecamatanDB,
  beforeActKecDB,
  totalKecamatanDB,
  getAllKecamatanDB,
  getKecByIdDB,
  updateKecByIdDB,
  deleteKecByIdDB,
} = require('./queries');

module.exports = {
  addKecamatan: async (req, res) => {
    let statusCode;

    try {
      const { nama_kec, kode_kec } = req.body;

      if (!nama_kec || !kode_kec) {
        statusCode = 400;
        throw new Error('Data harus lengkap.');
      } else if (kode_kec.length > 3) {
        statusCode = 400;
        throw new Error('Hanya boleh max 3 karakter.');
      }

      const kecamatan = await beforeActKecDB(nama_kec, kode_kec);

      if (kecamatan) {
        statusCode = 400;
        if (nama_kec === kecamatan.nama_kec) {
          throw new Error('Kecamatan sudah tersedia.');
        } else if (kode_kec === kecamatan.kode_kec) {
          throw new Error('Kode kecamatan sudah tersedia.');
        } else {
          throw new Error();
        }
      }

      await createKecamatanDB(nama_kec, kode_kec);

      return res.status(201).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getAllKecamatan: async (req, res) => {
    let statusCode;

    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await totalKecamatanDB(search);
      const totalPages = Math.ceil(totalRows.total / limit);
      const result = await getAllKecamatanDB(search, limit, offset);

      if (result.length < 1) {
        statusCode = 404;
        throw new Error('Hasil tidak ditemukan.');
      }

      return res.status(200).json({
        data: { message: 'success', result, page, limit, totalRows: totalRows.total, totalPages },
      });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getSingleKecamatan: async (req, res) => {
    let statusCode;

    try {
      const { id_kec } = parseInt(req.params.id_kec);

      if (id_kec < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const kecamatan = await getKecByIdDB(id_kec);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({ data: { message: 'success', result: kecamatan } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  updateKecamatan: async (req, res) => {
    let statusCode;

    try {
      const { nama_kec } = req.body;
      const { id_kec } = parseInt(req.params.id_kec);

      if (id_kec < 1) {
        statusCode = 400;
        throw new Error('error');
      } else if (!nama_kec || !id_kec) {
        statusCode = 400;
        throw new Error('Data harus lengkap.');
      }

      const kecamatan = await getKecByIdDB(id_kec);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      } else if (nama_kec === kecamatan.nama_kec) {
        statusCode = 409;
        throw new Error('Kecamatan sudah tersedia.');
      }

      await updateKecByIdDB(nama_kec, id_kec);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res
        .status(statusCode || 500)
        .json({ data: { message: error.message || 'Internal server error' } });
    }
  },
  deleteKecamatan: async (req, res) => {
    let statusCode;

    try {
      const { id_kec } = parseInt(req.params.id_kec);

      if (id_kec < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const kecamatan = await getKecByIdDB(id_kec);

      if (!kecamatan) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      await deleteKecByIdDB(id_kec);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
