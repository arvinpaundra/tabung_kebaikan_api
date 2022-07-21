const { conn } = require('../../../config');

let db = {};

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

db.totalKecamatanDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(nama_kec) AS total FROM kecamatan WHERE nama_kec LIKE ?`,
      [`%${search}%`],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0]);
      },
    );
  });
};

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
