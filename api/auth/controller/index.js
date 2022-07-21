const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDataUserByUsername, registerDB } = require('./queries');

module.exports = {
  register: async (req, res) => {
    let statusCode;

    try {
      const { fullname, username, password, id_kec } = req.body;

      if (!fullname || !username || !password || !id_kec) {
        statusCode = 400;
        throw new Error('Data harus lengkap!');
      }

      const user = await getDataUserByUsername(username.toLowerCase());

      if (user) {
        statusCode = 400;
        throw new Error('Username sudah terdaftar!');
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

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

      const user = await getDataUserByUsername(username.toLowerCase());

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
        { expiresIn: '3h' },
      );

      return res.status(200).json({ data: { message: 'success', token } });
    } catch (error) {
      return res.status(statusCode || 500).json({ data: { message: error.message } });
    }
  },
};
