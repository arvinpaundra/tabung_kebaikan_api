const jwt = require('jsonwebtoken');

module.exports = {
  isUserLogin: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null;

      const data = jwt.verify(token, process.env.JWT_SECRET);

      req.user_role = data.user.role;

      next();
    } catch (error) {
      return res.status(401).json({ data: { message: error.message } });
    }
  },
  isAdmin: async (req, res, next) => {
    try {
      if (req.user_role !== '0') {
        throw new Error('forbidden');
      }

      next();
    } catch (error) {
      return res.status(403).json({ data: { message: error.message } });
    }
  },
};
