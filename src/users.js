const bcrypt = require('bcrypt');
const query = require('./db.js');

async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }
  return false;
}

async function findByUsername(username) {
  const data = await query.select('SELECT * FROM users');
  const found = data.rows.find((u) => u.username === username);
  if (found) {
    return found;
  }
  return null;
}

async function findById(id) {
  const data = await query.select('SELECT * FROM users');
  const found = data.rows.find((u) => u.id === id);

  if (found) {
    return found;
  }
  return null;
}

module.exports = { comparePasswords, findByUsername, findById };
