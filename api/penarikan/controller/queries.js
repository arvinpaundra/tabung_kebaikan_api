const { conn } = require('../../../config');

let db = {};

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
