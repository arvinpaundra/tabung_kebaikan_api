const { conn } = require('../../../config');

let db = {};

/**
 *
 * @param {*} nominal required
 * @param {*} kode_tabung required
 * @param {*} id_munfiq required
 * @param {*} id_kec required
 * @param {*} id_user required
 * @description Membuat data penarikan tabung
 */

db.createPenarikanDB = (nominal, kode_tabung, id_munfiq, id_kec, id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO penarikan (nominal, tgl_tarik, kode_tabung, id_munfiq, id_kec, id_user) VALUES (?, CURDATE(), ?, ?, ?, ?)`,
      [nominal, kode_tabung, id_munfiq, id_kec, id_user],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

/**
 *
 * @param {*} search optional
 * @param {*} limits optional
 * @param {*} offset optional
 * @returns Semua data penarikan
 */

db.getAllPenarikanDB = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT penarikan.*, munfiq.id_munfiq, munfiq.fullname AS munfiq, munfiq.kode_tabung, kecamatan.nama_kec, users.fullname AS petugas FROM penarikan JOIN munfiq ON penarikan.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON penarikan.id_kec = kecamatan.id_kec JOIN users ON penarikan.id_user = users.id_user WHERE munfiq.fullname LIKE ? OR munfiq.kode_tabung LIKE ? OR kecamatan.nama_kec LIKE ? OR users.fullname LIKE ? ORDER BY penarikan.id_penarikan DESC LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      },
    );
  });
};

db.getDetailPenarikanDB = (id_penarikan) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM penarikan WHERE id_penarikan = ?`,
      [id_penarikan],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result[0]);
      },
    );
  });
};

/**
 *
 * @param {*} id_user required
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Data penarikan berdasarkan id_user
 */

db.getPenarikanPetugasDB = (id_user, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT penarikan.id_penarikan, penarikan.nominal, penarikan.tgl_tarik, munfiq.id_munfiq, munfiq.fullname FROM penarikan JOIN munfiq ON penarikan.id_munfiq = munfiq.id_munfiq WHERE id_user = ? AND munfiq.fullname LIKE ? ORDER BY penarikan.id_penarikan DESC LIMIT ? OFFSET ?`,
      [id_user, `%${search}%`, limit, offset],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      },
    );
  });
};

/**
 *
 * @param {*} search optional
 * @returns Total data seluruh penarikan
 */

db.totalPenarikanDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(penarikan.id_penarikan) AS total FROM penarikan JOIN munfiq ON penarikan.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON penarikan.id_kec = kecamatan.id_kec JOIN users ON penarikan.id_user = users.id_user WHERE munfiq.fullname LIKE ? OR munfiq.kode_tabung LIKE ? OR kecamatan.nama_kec LIKE ? OR users.fullname LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0]);
      },
    );
  });
};

/**
 *
 * @param {*} id_user required
 * @param {*} search optional
 * @returns Total data penarikan berdasarkan id_user
 */

db.totalPenarikanPetugasDB = (id_user, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(penarikan.id_penarikan) AS total FROM penarikan JOIN munfiq ON penarikan.id_munfiq = munfiq.id_munfiq JOIN users ON penarikan.id_user = users.id_user WHERE users.id_user = ? AND munfiq.fullname LIKE ?`,
      [id_user, `%${search}%`],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0]);
      },
    );
  });
};

db.getPenarikanTerbaruDB = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT penarikan.*, munfiq.fullname AS munfiq, kecamatan.nama_kec, users.fullname AS petugas FROM penarikan JOIN munfiq ON penarikan.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON penarikan.id_kec = kecamatan.id_kec JOIN users ON penarikan.id_user = users.id_user ORDER BY id_penarikan DESC LIMIT 10`,
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      },
    );
  });
};

/**
 *
 * @param {*} nominal required
 * @param {*} id_penarikan required
 * @description Mengubah data penarikan (Hanya admin)
 */

db.updatePenarikanByIdDB = (nominal, id_penarikan) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE penarikan SET nominal = ? WHERE id_penarikan = ?`,
      [nominal, id_penarikan],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

module.exports = db;
