const { conn } = require('../../../config');

let db = {};

db.getAllPetugasDB = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT users.id_user, users.fullname, users.username, users.role, users.id_kec, users.profile_picture, users.created_at, users.updated_at, nama_kec FROM users JOIN kecamatan ON users.id_kec = kecamatan.id_kec WHERE role = '1' AND fullname LIKE ? OR username LIKE ? ORDER BY fullname ASC LIMIT ? OFFSET ?`,
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

db.totalPetugasDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(id_user) AS total FROM users WHERE role = '1' AND fullname LIKE ? OR username LIKE ?`,
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

db.getPetugasByIdDB = (id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT users.*, kecamatan.nama_kec FROM users JOIN kecamatan ON users.id_kec = kecamatan.id_kec WHERE users.role = '1' AND id_user = ?`,
      [id_user],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0]);
      },
    );
  });
};

db.updatePetugasByIdDB = (fullname, username, id_kec, profile_picture, id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE users SET fullname = ?, username = ?, id_kec = ?, profile_picture = ? WHERE id_user = ?`,
      [fullname, username, id_kec, profile_picture, id_user],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

db.deletePetugasByIdDB = (id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(`DELETE FROM users WHERE id_user = ?`, [id_user], (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

module.exports = db;
