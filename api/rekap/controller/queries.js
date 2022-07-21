const { conn } = require('../../../config');

let db = {};

// db.createRekap = (bulan, tahun, status, id_munfiq, id_penarikan) => {
//   return new Promise((resolve, reject) => {
//     conn.query(`INSERT INTO rekap (bulan, tahun, status, id_munfiq, id_penarikan) VALUES (?, ?, ?, ?, ?)`, [bulan])
//   })
// }

/**
 *
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @param {*} limit
 * @param {*} offset
 * @returns Semua rekapan pada admin berdasarkan tahun dan bulan
 */

db.getAllRekapDB = (bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.id_munfiq, munfiq.fullname, kecamatan.id_kec, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ?) AND (munfiq.fullname LIKE ? OR kecamatan.nama_kec LIKE ? OR munfiq.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
      [bulan, tahun, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @returns Total data rekapan perbulan
 */

db.totalAllRekapDB = (bulan, tahun, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(rekap.id_rekap) AS total_rekap FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ?) AND (munfiq.fullname LIKE ? OR kecamatan.nama_kec LIKE ? OR rekap.kode_tabung LIKE ?)`,
      [bulan, tahun, `%${search}%`, `%${search}%`, `%${search}%`, search],
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
 * @param {*} status
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @param {*} limit
 * @param {*} offset
 * @returns Rekapan berdasarkan status penarikan, tahun dan bulan
 */

db.getRekapByStatusDB = (status, bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.fullname AS munfiq, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND rekap.status = ?) AND (munfiq.fullname LIKE ? OR kecamatan.nama_kec LIKE ? OR rekap.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
      [bulan, tahun, status, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} status
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @returns Total data rekap berdasarkan status penarikan
 */

db.totalRekapByStatusDB = (status, bulan, tahun, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(rekap.id_rekap) AS total_rekap FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND rekap.status = ?) AND (munfiq.fullname LIKE ? OR kecamatan.nama_kec LIKE ? OR rekap.kode_tabung LIKE ?)`,
      [bulan, tahun, status, `%${search}%`, `%${search}%`, `%${search}%`],
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
 * @param {*} id_kec
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @param {*} limit
 * @param {*} offset
 * @returns Rekapan berdasarkan kecamatan yang dipilih, tahun dan bulan
 */

db.getRekapByKecamatanDB = (id_kec, bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.fullname AS munfiq, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND kecamatan.id_kec = ?) AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
      [bulan, tahun, id_kec, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} id_kec
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @returns Total data rekap berdasarkan kecamatan
 */

db.totalRekapByKecamatanDB = (id_kec, bulan, tahun, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(rekap.id_rekap) AS total_rekap FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND kecamatan.id_kec = ?) AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?)`,
      [bulan, tahun, id_kec, `%${search}%`, `%${search}%`],
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
 * @param {*} bulan
 * @param {*} tahun
 * @returns Total nominal penarikan seluruh kecamatan perbulan
 */

db.getRekapTotalPenarikanDB = (bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(rekap.nominal), 0) AS total_penarikan FROM rekap WHERE bulan = ? AND tahun = ? AND status = '1'`,
      [bulan, tahun],
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
 * @param {*} id_kec
 * @param {*} bulan
 * @param {*} tahun
 * @returns Total nominal penarikan perkecamatan
 */

db.getRekapTotalPenarikanKecamatanDB = (id_kec, bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(rekap.nominal), 0) AS total_penarikan FROM rekap JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE kecamatan.id_kec = ? AND rekap.bulan = ? AND rekap.tahun = ? AND rekap.status = '1'`,
      [id_kec, bulan, tahun],
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
 * @param {*} id_user
 * @param {*} bulan
 * @param {*} tahun
 * @returns Total nominal penarikan milik masing masing petugas
 */

db.getRekapTotalPenarikanPetugasDB = (id_user, bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(rekap.nominal), 0) AS total_penarikan FROM rekap JOIN users ON rekap.id_user = users.id_user WHERE users.id_user = ? AND rekap.bulan = ? AND rekap.tahun = ?`,
      [id_user, bulan, tahun],
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
 * @param {*} id_kec
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @param {*} limit
 * @param {*} offset
 * @returns Rekapan dengan status belum ditarik pada petugas
 */

db.getRekapBelumDitarikPetugasDB = (id_kec, bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.fullname AS munfiq, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND kecamatan.id_kec = ? AND rekap.status = '0') AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
      [bulan, tahun, id_kec, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} id_kec
 * @param {*} id_user
 * @param {*} bulan
 * @param {*} tahun
 * @param {*} search
 * @returns Total rekapan data belum ditarik oleh petugas
 */

db.totalRekapBelumDitarikPetugasDB = (id_kec, bulan, tahun, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(rekap.id_rekap) AS total_rekap FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND kecamatan.id_kec = ? AND rekap.status = '0') AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC`,
      [bulan, tahun, id_kec, `%${search}%`, `%${search}%`],
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
 * @param {*} kode_tabung
 * @description Check status tabung sebelum update
 */

db.beforeUpdateRekapDB = (kode_tabung) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT id_rekap FROM rekap WHERE bulan = MONTHNAME(CURDATE()) AND tahun = YEAR(CURDATE()) AND status = '0' AND kode_tabung = ? ORDER BY id_rekap DESC LIMIT 1`,
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
 * @param {*} nominal
 * @param {*} id_user
 * @param {*} id_rekap
 * @returns Update data rekap oleh petugas
 */

db.updateCurrentRekapDB = (nominal, id_user, id_rekap) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE rekap SET nominal = ?, tgl_tarik = CURDATE(), status = '1', id_user = ? WHERE id_rekap = ?`,
      [nominal, id_user, id_rekap],
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
