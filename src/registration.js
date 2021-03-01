const pool = require('./db');

function name(n) {
  return n.trim() === '';
}

async function duplicateId(id) {
  const exists = await pool.pool.query(
    'SELECT id from signatures WHERE nationalid = $1',
    [id],
  );
  return exists.rows.length > 0;
}

function formatId(id) {
  const idtest = /\d{6}-?\d{4}/gm;
  return idtest.test(id);
}

function formatid(id) {
  const idWithSlash = /\d{6}-\d{4}/gm;
  if (idWithSlash.test(id)) return id.replace('-', '');
  return id;
}

async function register(usrdata) {
  let check = false;
  const errors = [false, false, false, false];
  if (name(usrdata.name)) errors[0] = true;
  if (usrdata.kennitala === '') {
    errors[1] = true;
    errors[2] = true;
  } else if (!formatId(usrdata.kennitala)) errors[2] = true;
  else if (await duplicateId(usrdata.kennitala)) errors[3] = true;
  if (usrdata.check === 'on') check = true;
  formatId(usrdata.kennitala);
  let err = 0;
  for (let i = 0; i < errors.length; i += 1) {
    if (errors[i]) err += 1;
  }
  if (err > 0) return errors;
  const id = formatid(usrdata.kennitala);
  pool.pool.query(
    'INSERT INTO signatures(name, nationalid, comment, anonymous) VALUES($1, $2, $3, $4) RETURNING *',
    [usrdata.name, id, usrdata.athugasemd, check],
  );
  return errors;
}

module.exports = { register };
