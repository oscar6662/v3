const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const list = require('./list');
const ad = require('./admin');
const reg = require('./registration');
const lib = require('./login');

const sessionSecret = 'leyndarmál';

dotenv.config();
const app = express();
const errors = [false, false, false, false];

const {
  PORT: port = 3000,
} = process.env;

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

app.get('/', async (req, res) => { list.render(req, res, errors); });

app.post('/', async (req, res) => {
  try {
    const usrdata = req.body;
    if (typeof usrdata.id !== 'undefined') {
      if (!req.isAuthenticated()) {
        res.redirect('/login');
        return;
      }
      await ad.del(usrdata.id);
      await list.render(req, res, errors);
      return;
    }
    const possibleerrors = await reg.register(usrdata);
    if (possibleerrors[3] && !possibleerrors[0] && !possibleerrors[1] && !possibleerrors[2]) {
      res.render('dupeId');
      return;
    }
    list.render(req, res, possibleerrors);
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/admin', lib.ensureLoggedIn, async (req, res) => {
  try {
    res.render('admin', { loggedIn: req.isAuthenticated(), admin: req.user.admin });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post(
  '/login',

  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return res.render('login');
});

app.get('*', (req, res) => {
  res.render('error', { url: req.url });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
