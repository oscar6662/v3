const bcrypt = require('bcrypt');
const query = require('./db.js')
const records = [
  {
    id: 1,
    username: 'admin',

    // 123
    password: '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
    admin: true,
  },
  {
    id: 2,
    username: 'oli',

    // 123
    password: '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii',
    admin: false,
  },
];

async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }

  return false;
}

// Merkjum sem async þó ekki verið að nota await, þar sem þetta er notað í
// app.js gerir ráð fyrir async falli
async function findByUsername(username) {
  const found = records.find((u) => u.username === username);

  if (found) {
    return found;
  }

  return null;
}

// Merkjum sem async þó ekki verið að nota await, þar sem þetta er notað í
// app.js gerir ráð fyrir async falli
async function findById(id) {
  const found = records.find((u) => u.id === id);

  if (found) {
    return found;
  }

  return null;
}

module.exports = { comparePasswords, findByUsername, findById  };
