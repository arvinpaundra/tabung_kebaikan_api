const { conn } = require('../../../config');

let db = {};

/**
 *
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Data semua petugas
 */

db.getAllPetugasDB = (search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT users.id_user, users.fullname, users.username, users.role, users.id_kec, users.profile_picture, users.created_at, users.updated_at, nama_kec FROM users JOIN kecamatan ON users.id_kec = kecamatan.id_kec WHERE (role = '1') AND (fullname LIKE ? OR username LIKE ?) ORDER BY fullname ASC LIMIT ? OFFSET ?`,
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
 * @returns Total petugas
 */

db.totalPetugasDB = (search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(id_user) AS total FROM users WHERE (role = '1') AND (fullname LIKE ? OR username LIKE ?)`,
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
 * @param {*} username required
 * @returns Petugas berdasarkan username
 */

db.getPetugasByUsernameDB = (username) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT users.*, kecamatan.nama_kec FROM users JOIN kecamatan ON users.id_kec = kecamatan.id_kec WHERE users.role = '1' AND username = ?`,
      [username],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result[0]);
      },
    );
  });
};

db.getUserByIdDB = (id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT users.*, kecamatan.nama_kec FROM users JOIN kecamatan ON users.id_kec = kecamatan.id_kec WHERE id_user = ?`,
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

/**
 *
 * @param {*} fullname required
 * @param {*} username required
 * @param {*} id_kec required
 * @param {*} profile_picture required
 * @param {*} id_user required
 * @description Ubah data petugas berdasarkan id_user
 */

db.updatePetugasByIdDB = (fullname, username, profile_picture, id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE users SET fullname = ?, username = ?, profile_picture = ? WHERE id_user = ?`,
      [fullname, username, profile_picture, id_user],
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
 * @param {*} id_user required
 * @description Hapus petugas berdasarkan id_user (Not recommended)
 */

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
