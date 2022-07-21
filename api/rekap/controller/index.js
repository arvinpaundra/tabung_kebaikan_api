const {
  totalAllRekapDB,
  getAllRekapDB,
  totalRekapByStatusDB,
  getRekapByStatusDB,
  totalRekapByKecamatanDB,
  getRekapByKecamatanDB,
  getRekapTotalPenarikanDB,
  getRekapTotalPenarikanKecamatanDB,
  getRekapTotalPenarikanPetugasDB,
} = require('./queries');

module.exports = {
  getAllRekap: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await totalAllRekapDB(month, year, search);
      const totalPages = Math.ceil(totalRows.total_rekap / limit);
      const result = await getAllRekapDB(month, year, search, limit, offset);

      if (!result) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({
        data: {
          message: 'success',
          result,
          page,
          limit,
          totalRows: totalRows.total_rekap,
          totalPages,
        },
      });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getRekapByStatus: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();
      const status = req.query.status || '';

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await totalRekapByStatusDB(status, month, year, search);
      const totalPages = Math.ceil(totalRows.total_rekap / limit);
      const result = await getRekapByStatusDB(status, month, year, search, limit, offset);

      if (!result) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({
        data: {
          message: 'success',
          result,
          page,
          limit,
          totalRows: totalRows.total_rekap,
          totalPages,
        },
      });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getRekapByKecamatan: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();
      const id_kec = parseInt(req.query.id_kec) || 0;

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await totalRekapByKecamatanDB(id_kec, month, year, search);
      const totalPages = Math.ceil(totalRows.total_rekap / limit);
      const result = await getRekapByKecamatanDB(id_kec, month, year, search, limit, offset);

      if (!result) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      return res.status(200).json({
        data: {
          message: 'success',
          result,
          page,
          limit,
          totalRows: totalRows.total_rekap,
          totalPages,
        },
      });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getTotalNominalPenarikan: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();

      const result = await getRekapTotalPenarikanDB(month, year);

      return res.status(200).json({ data: { message: 'success', result } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getTotalNominalKecamatan: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();
      const id_kec = parseInt(req.params.id_kec) || 0;

      const result = await getRekapTotalPenarikanKecamatanDB(id_kec, month, year);

      return res.status(200).json({ data: { message: 'success', result } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getTotalNominalPetugas: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();
      const id_user = parseInt(req.params.id_user) || 0;

      const result = await getRekapTotalPenarikanPetugasDB(id_user, month, year);

      return res.status(200).json({ data: { message: 'success', result } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
