const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const utf8 = require('utf8');
const pool = require('./db');
const reg = require('./registration');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const lib = require('./login');
const sessionSecret = 'leyndarmál';
const session = require('express-session');

dotenv.config();

const {
  PORT: port = 3000,
} = process.env;

const app = express();

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000,
}));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
});



app.get('/', async (req, res) => {
  try {
    const errors = [false, false, false, false];
    const allSignatures = await pool.select('SELECT * FROM signatures');
    utf8.decode(allSignatures);
    res.render('index', { data: allSignatures.rows, errors });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/', async (req, res) => {
  try {
    const usrdata = req.body;
    const possibleerrors = await reg.register(usrdata);
    if (possibleerrors[3] && !possibleerrors[0] && !possibleerrors[1] && !possibleerrors[2]) {
      res.render('regerrors');
    } else {
      const allSignatures = await pool.select('SELECT * FROM signatures');
      utf8.decode(allSignatures);
      res.render('index', { data: allSignatures.rows, errors: possibleerrors });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/admin', lib.ensureLoggedIn, (req, res) => {
  res.send(`
    <p>You have been logged in</p>
    <p><a href="/">Forsíða</a></p>
  `);
});

app.get('/logout', (req, res) => {
  // logout hendir session cookie og session
  req.logout();
  res.redirect('/');
});

app.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),
  (req, res) => {
    console.log(req.user.admin);
    res.redirect('/admin');
  },
);

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  let message = '';



  return res.send(`
    <form method="post" action="/login" autocomplete="off">
      <label>Notendanafn: <input type="text" name="username"></label>
      <label>Lykilorð: <input type="password" name="password"></label>
      <button>Innskrá</button>
    </form>
    <p>${message}</p>
  `);
});

app.get('*', (req, res) => {
  res.render('error', { url: req.url });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
