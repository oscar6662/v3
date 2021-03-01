
let pool = require('./db');

async function del(id){
  pool.insert('DELETE FROM signatures WHERE id=$1', [id]);
}

module.exports = {del};
