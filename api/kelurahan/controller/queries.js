const { conn } = require('../../../config');

let db = {};

db.getAllKelurahanDB = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM kelurahan WHERE nama_kel LIKE ? ORDER BY nama_kel ASC LIMIT ? OFFSET ?`,
      [`%${search}%`, limit, offset],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      },
    );
  });
};

db.getKelurahanByIdDB = (id_kel) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM kelurahan WHERE id_kel = ?`, [id_kel], (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result[0]);
    });
  });
};

db.getTotalKelurahanDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(id_kel) AS total FROM kelurahan WHERE nama_kel LIKE ?`,
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

db.createKelurahanDB = (nama_kel, id_kel) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO kelurahan (nama_kel, id_kec) VALUES (?, ?)`,
      [nama_kel, id_kel],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

db.updateKelurahanByIdDB = (nama_kel, id_kec, id_kel) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE kelurahan SET nama_kel = ?, id_kec = ? WHERE id_kel = ?`,
      [nama_kel, id_kec, id_kel],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

db.deleteKelurahanByIdDB = (id_kel) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM kelurahan WHERE id_kel = ?`, [id_kel], (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

module.exports = db;
