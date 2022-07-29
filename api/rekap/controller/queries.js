const { conn } = require('../../../config');

let db = {};

/**
 *
 * @returns Total keseluruhan pendapatan saldo penarikan tabung
 */

db.getTotalKeselurhanSaldoDB = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(nominal), 0) AS total_saldo FROM rekap WHERE status = '1'`,
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
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Semua rekapan pada admin berdasarkan tahun dan bulan
 */

db.getAllRekapDB = (bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.id_munfiq, munfiq.fullname AS munfiq, kecamatan.id_kec, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ?) AND (munfiq.fullname LIKE ? OR munfiq.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
      [bulan, tahun, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @returns Total data rekapan perbulan
 */

db.totalAllRekapDB = (bulan, tahun, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(COUNT(rekap.id_rekap), 0) AS total_rekap FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ?) AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?)`,
      [bulan, tahun, `%${search}%`, `%${search}%`, search],
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
 * @param {*} status required
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Rekapan berdasarkan status penarikan, tahun dan bulan
 */

db.getRekapByStatusDB = (status, bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.fullname AS munfiq, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND rekap.status = ?) AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
      [bulan, tahun, status, `%${search}%`, `%${search}%`, limit, offset],
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
 * @param {*} status required
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @returns Total data rekap berdasarkan status penarikan
 */

db.totalRekapByStatusDB = (status, bulan, tahun, search) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT COUNT(rekap.id_rekap) AS total_rekap FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND rekap.status = ?) AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?)`,
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
 * @param {*} id_kec required
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Rekapan berdasarkan kecamatan yang dipilih, tahun dan bulan
 */

db.getRekapByKecamatanDB = (id_kec, bulan, tahun, search, limit, offset) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT rekap.*, munfiq.fullname AS munfiq, munfiq.no_tlp, munfiq.alamat, munfiq.kelurahan, kecamatan.nama_kec FROM rekap JOIN munfiq ON rekap.id_munfiq = munfiq.id_munfiq JOIN kecamatan ON rekap.id_kec = kecamatan.id_kec WHERE (rekap.bulan = ? AND rekap.tahun = ? AND kecamatan.id_kec = ?) AND (munfiq.fullname LIKE ? OR rekap.kode_tabung LIKE ?) ORDER BY rekap.id_rekap DESC LIMIT ? OFFSET ?`,
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
 * @param {*} id_kec required
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
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
 * @param {*} bulan required
 * @param {*} tahun required
 * @returns Total nominal seluruh kecamatan perbulan
 */

db.getRekapTotalNominalPerbulanDB = (bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(rekap.nominal), 0) AS total FROM rekap WHERE bulan = ? AND tahun = ? AND status = '1'`,
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

db.getRekapTotalPenarikanPerbulanDB = (bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(COUNT(id_rekap), 0) AS total FROM rekap WHERE status = '1' AND bulan = ? AND tahun = ?`,
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
 * @param {*} id_kec required
 * @param {*} bulan required
 * @param {*} tahun required
 * @returns Total nominal perkecamatan perbulan
 */

db.getRekapNominalKecamatanBulanDB = (id_kec, bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(nominal), 0) AS total FROM rekap WHERE id_kec = ? AND bulan = ? AND tahun = ? AND status = '1'`,
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

db.getRekapPenarikanKecamatanBulanDB = (id_kec, bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(COUNT(id_rekap), 0) AS total FROM rekap WHERE id_kec = ? AND bulan = ? AND tahun = ? AND status = '1'`,
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
 * @param {*} id_user required
 * @param {*} bulan required
 * @param {*} tahun required
 * @returns Total nominal penarikan milik masing masing petugas perbulan
 */

db.getRekapNominalPetugasBulanDB = (id_user, bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(SUM(nominal), 0) AS total FROM rekap WHERE id_user = ? AND bulan = ? AND tahun = ?`,
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

db.getRekapPenarikanPetugasBulanDB = (id_user, bulan, tahun) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(COUNT(id_rekap), 0) AS total FROM rekap WHERE id_user = ? AND bulan = ? AND tahun = ? AND status = '1'`,
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
 * @param {*} id_kec required
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @param {*} limit optional
 * @param {*} offset optional
 * @returns Rekapan dengan status belum ditarik pada petugas perbulan
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
 * @param {*} id_kec required
 * @param {*} id_user required
 * @param {*} bulan required
 * @param {*} tahun required
 * @param {*} search optional
 * @returns Total rekapan data belum ditarik oleh petugas perbulan
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
 * @param {*} kode_tabung required
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
 * @param {*} nominal required
 * @param {*} id_user required
 * @param {*} id_rekap required
 * @description Update data rekap oleh petugas
 */

db.updateCurrentRekapDB = (nominal, kondisi_tabung, id_user, id_rekap) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE rekap SET nominal = ?, kondisi_tabung = ?, tgl_tarik = CURDATE(), status = '1', id_user = ? WHERE id_rekap = ?`,
      [nominal, kondisi_tabung, id_user, id_rekap],
      (err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      },
    );
  });
};

db.afterUpdatePenarikanDB = (bulan, tahun, nominal, kode_tabung) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE rekap SET nominal = ? WHERE bulan = ? AND tahun = ? AND kode_tabung = ?`,
      [nominal, bulan, tahun, kode_tabung],
      (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      },
    );
  });
};

module.exports = db;
