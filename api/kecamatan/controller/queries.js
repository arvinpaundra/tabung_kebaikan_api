const { conn } = require('../../../config');

let db = {};

/**
 *
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Semua data kecamatan
 */

db.getAllKecamatanDB = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM kecamatan WHERE nama_kec LIKE ? OR kode_kec LIKE ? ORDER BY nama_kec ASC LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, limit, offset],
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
 * @returns Total data kecamatan
 */

db.totalKecamatanDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(nama_kec) AS total FROM kecamatan WHERE nama_kec LIKE ? OR kode_kec LIKE ?`,
      [`%${search}%`, `%${search}%`],
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
 * @param {*} id_kec required
 * @returns Kecamatan berdasarkan id_kec
 */

db.getKecByIdDB = (id_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM kecamatan WHERE id_kec = ?`, [id_kec], (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result[0]);
    });
  });
};

/**
 *
 * @param {*} nama_kec required
 * @param {*} kode_kec required
 * @description Pengecekan ketersediaan kecamatan
 */

db.beforeActKecDB = (nama_kec, kode_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT id_kec, nama_kec, kode_kec FROM kecamatan WHERE nama_kec = ? OR kode_kec = ?`,
      [nama_kec, kode_kec],
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
 * @param {*} nama_kec required
 * @param {*} kode_kec required
 * @description Menambahkan data kecamatan (Hanya admin)
 */

db.createKecamatanDB = (nama_kec, kode_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO kecamatan (nama_kec, kode_kec) VALUES (?, ?)`,
      [nama_kec, kode_kec],
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
 * @param {*} nama_kec required
 * @param {*} id_kec rqeuired
 * @description Mengubah data kecamatan berdasarkan id_kec (Hanya admin)
 */

db.updateKecByIdDB = (nama_kec, id_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(`UPDATE kecamatan SET nama_kec = ? WHERE id_kec = ?`, [nama_kec, id_kec], (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

/**
 *
 * @param {*} id_kec required
 * @description Hapus kecamatan berdasarkan id_kec (Not recommended)
 */

db.deleteKecByIdDB = (id_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM kecamatan WHERE id_kec = ?`, [id_kec], (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

module.exports = db;
