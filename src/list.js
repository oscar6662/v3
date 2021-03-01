const pool = require('./db');

async function render(req, res, errors) {
  let admin;
  try {
    if (req.query.page == null) req.query.page = 1;
    if (req.user == null) admin = false;
    else admin = req.user.admin;
    const n = await pool.select('SELECT COUNT(*) AS count FROM signatures;');
    const pages = Math.ceil(n.rows[0].count / 50);
    const allSignatures = await pool.insert('SELECT * FROM signatures ORDER BY signed LIMIT 50 OFFSET $1;', [(req.query.page - 1) * 50]);
    res.render('index',
      {
        data: allSignatures.rows,
        errors,
        page: req.query.page,
        pages,
        admin,
        n: n.rows[0].count,
        loggedIn: req.isAuthenticated(),
      });
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = { render };
