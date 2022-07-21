const { conn } = require('../../../config');

let db = {};

db.getDataUserByUsername = (username) => {
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

module.exports = db;
