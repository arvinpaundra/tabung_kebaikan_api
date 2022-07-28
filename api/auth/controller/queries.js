const { conn } = require('../../../config');

let db = {};

/**
 *
 * @param {*} username required
 * @returns Data petugas berdasarkan username
 */

db.getDataUserByUsernameDB = (username) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT id_user, password, role, id_kec FROM users WHERE username = ?`,
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

/**
 *
 * @param {*} fullname
 * @param {*} username
 * @param {*} password
 * @param {*} id_kec
 * @description Register petugas (Hanya admin)
 */

db.registerDB = (fullname, username, password, id_kec) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `INSERT INTO users (fullname, username, password, id_kec) VALUES (?, ?, ?, ?)`,
      [fullname, username, password, id_kec],
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
 * @param {*} password
 * @param {*} username
 * @param {*} id_user
 * @description Reset password user (Hanya admin)
 */

db.resetPasswordDB = (password, username, id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE users SET password = ? WHERE username = ? AND id_user = ?`,
      [password, username, id_user],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

db.changePasswordDB = (password, username, id_user) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE users SET password = ? WHERE id_user = ? AND username= ?`,
      [password, id_user, username],
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
