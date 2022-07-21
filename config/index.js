const path = require('path');
const { conn } = require('./db');

module.exports = {
  conn: conn,
  rootPath: path.resolve(__dirname, '..'),
};
