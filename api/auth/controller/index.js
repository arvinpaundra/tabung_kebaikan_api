const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  getDataUserByUsernameDB,
  registerDB,
  resetPasswordDB,
  changePasswordDB,
} = require('./queries');

module.exports = {
  addPetugas: async (req, res) => {
    let statusCode;

    try {
      const { fullname, username, id_kec } = req.body;

      if (!fullname || !username || !id_kec) {
        statusCode = 400;
        throw new Error('Data harus lengkap!');
      }

      const user = await getDataUserByUsernameDB(username.toLowerCase());

      if (user) {
        statusCode = 400;
        throw new Error('Username sudah terdaftar!');
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(process.env.USER_PASS, salt);

      await registerDB(fullname, username.toLowerCase(), hashedPassword, id_kec);

      return res.status(201).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  login: async (req, res) => {
    let statusCode;

    try {
      const { username, password } = req.body;

      if (!username || !password) {
        statusCode = 400;
        throw new Error('Data harus lengkap!');
      }

      const user = await getDataUserByUsernameDB(username.toLowerCase());

      if (!user) {
        statusCode = 409;
        throw new Error('Username atau password salah!');
      }

      const checkPassword = bcrypt.compareSync(password, user.password);

      if (!checkPassword) {
        statusCode = 409;
        throw new Error('Username atau password salah!');
      }

      const token = jwt.sign(
        {
          user: {
            id_user: user.id_user,
            id_kec: user.id_kec,
            role: user.role,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRED },
      );

      return res.status(200).json({ data: { message: 'success', token } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  resetPassword: async (req, res) => {
    let statusCode;

    try {
      const id_user = parseInt(req.params.id_user) || 0;
      const { username } = req.query;

      const petugas = await getDataUserByUsernameDB(username);

      if (!petugas || id_user !== petugas.id_user) {
        statusCode = 404;
        throw new Error('Data tidak ditemukan.');
      }

      const salt = bcrypt.genSaltSync(10);
      const newPassword = bcrypt.hashSync(process.env.RESET_PASS, salt);

      await resetPasswordDB(newPassword, username, id_user);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
  changePasswordUser: async (req, res) => {
    let statusCode;

    try {
      const id_user = parseInt(req.params.id_user) || 0;
      const password1 = req.body.password1 || '';
      const password2 = req.body.password2 || '';
      const username = req.query.username || '';

      if (!id_user || !password1 || !password2 || !username) {
        statusCode = 400;
        throw new Error('Data harus lengkap');
      } else if (id_user < 1) {
        statusCode = 400;
        throw new Error('error');
      } else if (password1 !== password2) {
        throw new Error('Pengulangan password salah.');
      }

      const salt = bcrypt.genSaltSync(10);
      const newPassword = bcrypt.hashSync(password2, salt);

      await changePasswordDB(newPassword, username, id_user);

      return res.status(200).json({ data: { message: 'success' } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
