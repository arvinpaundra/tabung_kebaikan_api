const { conn } = require('../../../config');

let db = {};

/**
 *
 * @param {*} fullname required
 * @param {*} no_tlp required
 * @param {*} alamat required
 * @param {*} kode_tabung required
 * @param {*} id_kec required
 * @param {*} kelurahan required
 * @description Menambahkan munfiq
 */

db.createMunfiqDB = (fullname, no_tlp, alamat, kode_tabung, id_kec, kelurahan) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO munfiq (fullname, no_tlp, alamat, kode_tabung, id_kec, kelurahan) VALUES (?, ?, ?, ?, ?, ?)`,
      [fullname, no_tlp, alamat, kode_tabung, id_kec, kelurahan],
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
 * @returns Total data munfiq
 */

db.totalMunfiqDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(munfiq.id_munfiq) AS total FROM munfiq JOIN kecamatan ON munfiq.id_kec = kecamatan.id_kec WHERE munfiq.fullname LIKE ? OR kecamatan.nama_kec LIKE ? OR munfiq.kelurahan LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`],
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
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Semua data munfiq
 */

db.getAllMunfiqDB = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT munfiq.*, kecamatan.nama_kec FROM munfiq JOIN kecamatan ON munfiq.id_kec = kecamatan.id_kec WHERE munfiq.fullname LIKE ? OR kecamatan.nama_kec LIKE ? OR munfiq.kelurahan LIKE ? ORDER BY munfiq.fullname ASC LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} id_kec required
 * @description Generate kode tabung sebelum menambahkan munfiq
 */

db.generateKodeTabungDB = (id_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT CONCAT(kecamatan.kode_kec, '-', IFNULL(MAX(munfiq.id_munfiq), 0) + 1) AS kode_tabung FROM munfiq JOIN kecamatan ON munfiq.id_kec = kecamatan.id_kec WHERE kecamatan.id_kec = ?`,
      [id_kec],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0].kode_tabung);
      },
    );
  });
};

/**
 *
 * @param {*} kode_tabung required
 * @returns Data munfiq berdasarkan kode_tabung
 */

db.getMunfiqByKodeTabungDB = (kode_tabung) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT munfiq.*, kecamatan.nama_kec FROM munfiq JOIN kecamatan ON munfiq.id_kec = kecamatan.id_kec WHERE kode_tabung = ?`,
      [kode_tabung],
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
 * @param {*} id_munfiq required
 * @returns Data munfiq berdasarkan id_munfiq
 */

db.getMunfiqByIdDB = (id_munfiq) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT munfiq.*, kecamatan.nama_kec FROM munfiq JOIN kecamatan ON munfiq.id_kec = kecamatan.id_kec WHERE munfiq.id_munfiq = ?`,
      [id_munfiq],
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
 * @param {*} fullname required
 * @param {*} no_tlp required
 * @param {*} alamat required
 * @param {*} id_kec required
 * @param {*} kelurahan required
 * @param {*} id_munfiq required
 * @description Ubah data munfiq berdasarkan id_munfiq (Hanya admin)
 */

db.updateMunfiqByIdDB = (fullname, no_tlp, alamat, id_kec, kelurahan, id_munfiq) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE munfiq SET fullname = ?, no_tlp = ?, alamat = ?, id_kec = ?, kelurahan = ? WHERE id_munfiq = ?`,
      [fullname, no_tlp, alamat, id_kec, kelurahan, id_munfiq],
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
 * @param {*} id_munfiq required
 * @description Hapus data munfiq (Not recommended)
 */

db.deleteMunfiqByIdDB = (id_munfiq) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM munfiq WHERE id_munfiq = ?`, [id_munfiq], (err) => {
      if (err) {
        return reject(err);
      }
    });

    return resolve();
  });
};

module.exports = db;
