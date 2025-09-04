const bcrypt = require("bcrypt");
const SALT = 10;

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
