const path = require('path');
const fs = require('fs');
const { rootPath } = require('../../../config');
const {
  totalPetugasDB,
  getAllPetugasDB,
  getPetugasByIdDB,
  updatePetugasByIdDB,
  deletePetugasByIdDB,
} = require('./queries');
const {
  totalPenarikanPetugasDB,
  getPenarikanPetugasDB,
} = require('../../penarikan/controller/queries');
const {
  totalRekapBelumDitarikPetugasDB,
  getRekapBelumDitarikPetugasDB,
} = require('../../rekap/controller/queries');

module.exports = {
  getAllPetugas: async (req, res) => {
    let statusCode;

    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;
      const totalRows = await totalPetugasDB(search);
      const totalPages = Math.ceil(totalRows.total / limit);
      const result = await getAllPetugasDB(search, limit, offset);

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
  getDetailPetugas: async (req, res) => {
    let statusCode;

    try {
      const id_user = parseInt(req.params.id_user);

      if (id_user < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const petugas = await getPetugasByIdDB(id_user);

      if (!petugas) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      delete petugas.password;

      return res.status(200).json({ data: { message: 'success', result: petugas } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  getPenarikanPetugas: async (req, res) => {
    let statusCode;

    try {
      const date = new Date();
      const month = req.query.month || date.toLocaleDateString('en-US', { month: 'long' });
      const year = parseInt(req.query.year) || date.getFullYear();

      const id_user = parseInt(req.params.id_user);
      const id_kec = parseInt(req.query.id_kec);
      const status = req.query.status.toUpperCase() || '';
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || '';
      const offset = limit * page;

      if (status === 'Y') {
        const totalRows = await totalPenarikanPetugasDB(id_user, search);
        const totalPages = Math.ceil(totalRows.total / limit);
        const result = await getPenarikanPetugasDB(id_user, search, limit, offset);
        if (id_user < 0 || !id_user) {
          statusCode = 409;
          throw new Error('error');
        } else if (!result) {
          statusCode = 404;
          throw new Error('Data tidak ditemukan.');
        }

        return res.status(200).json({
          data: { message: 'success', result, page, limit, totalRows: totalRows.total, totalPages },
        });
      } else if (status === 'N') {
        const totalRows = await totalRekapBelumDitarikPetugasDB(id_kec, month, year, search);
        const totalPages = Math.ceil(totalRows.total_rekap / limit);
        const result = await getRekapBelumDitarikPetugasDB(
          id_kec,
          month,
          year,
          search,
          limit,
          offset,
        );

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
      } else {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  updatePetugas: async (req, res) => {
    let statusCode;

    try {
      const { fullname, username } = req.body;
      const id_kec = parseInt(req.params.id_user);
      const id_user = parseInt(req.params.id_user);

      if (!fullname || !username) {
        statusCode = 400;
        throw new Error('Data harus lengkap.');
      } else if (id_kec < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      if (req.file) {
        try {
          let tmp_path = req.file.path;
          let originalExt =
            req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
          let filename = `${req.file.filename}.${originalExt}`;
          let target_path = path.resolve(rootPath, `public/uploads/profiles/${filename}`);

          const src = fs.createReadStream(tmp_path);
          const dest = fs.createWriteStream(target_path);

          src.pipe(dest);

          src.on('end', async () => {
            try {
              const petugas = await getPetugasByIdDB(id_user);

              if (!petugas) {
                statusCode = 404;
                throw new Error('Data tidak ditemukan.');
              } else if (username === petugas.username) {
                statusCode = 409;
                throw new Error('Username sudah tersedia.');
              }

              let currentImage = `${rootPath}/public/uploads/profiles/${petugas.profile_picture}`;

              if (fs.existsSync(currentImage) && petugas.profile_picture !== 'default.png') {
                fs.unlink(currentImage, (err) => {
                  if (err) throw err;
                });
              }

              await updatePetugasByIdDB(fullname, username, id_kec, filename, id_user);

              return res.status(200).json({ data: { message: 'success' } });
            } catch (error) {
              return res.status(statusCode || 500).json({ data: { message: error.message } });
            }
          });
        } catch (error) {
          return res.status(statusCode || 500).json({ data: { message: error.message } });
        }
      } else {
        try {
          const petugas = await getPetugasByIdDB(id_user);

          if (!petugas) {
            statusCode = 404;
            throw new Error('Data tidak ditemukan.');
          } else if (username === petugas.username) {
            statusCode = 409;
            throw new Error('Username sudah tersedia.');
          }

          await updatePetugasByIdDB(fullname, username, id_kec, petugas.profile_picture, id_user);

          return res.status(200).json({ data: { message: 'success' } });
        } catch (error) {
          return res.status(statusCode || 500).json({ data: { message: error.message } });
        }
      }
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  deletePetugas: async (req, res) => {
    let statusCode;

    try {
      const id_user = parseInt(req.params.id_user);

      if (id_user < 1) {
        statusCode = 400;
        throw new Error('error');
      }

      const petugas = await getPetugasByIdDB(id_user);

      if (!petugas) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      let currentImage = `${rootPath}/public/uploads/profiles/${petugas.profile_picture}`;

      if (fs.existsSync(currentImage) && petugas.profile_picture !== 'default.png') {
        fs.unlink(currentImage, (err) => {
          if (err) throw err;
        });
      }

      await deletePetugasByIdDB(id_user);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
