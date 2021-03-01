let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let dotenv = require('dotenv');
let utf8 = require('utf8');
let pool = require('./db');
let ad = require('./admin');
let reg = require('./registration');
let passport = require('passport');
let Strategy = require('passport-local').Strategy;
let lib = require('./login');
let sessionSecret = 'leyndarmál';
let session = require('express-session');
const { kStringMaxLength } = require('buffer');

dotenv.config();

let {
  PORT: port = 3000,
} = process.env;

let app = express();
let errors = [false, false, false, false];

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
  
  render(req,res,errors);
});

async function render(req,res,errors){
  try {
    if(req.query.page == null) req.query.page = 1;
    if(req.user == null) admin = false;
    else admin = req.user.admin;
    let n = await pool.select('SELECT COUNT(*) AS count FROM signatures;');
    let pages = Math.ceil(n.rows[0].count/50);
    let allSignatures = await pool.insert('SELECT * FROM signatures LIMIT 50 OFFSET $1;',[(req.query.page-1)*50] );
    res.render('index', { data: allSignatures.rows, errors, page: req.query.page, pages, admin, n:n.rows[0].count, loggedIn:req.isAuthenticated()});
  } catch (err) {
    console.error(err.message);
  }
}

app.post('/', async (req, res) => {
  try {
    let usrdata = req.body;
    if(typeof usrdata.id !== 'undefined'){
      if (!req.isAuthenticated()) {
        return res.redirect('/login');
      }
      await ad.del(usrdata.id);
      await render(req,res,errors);
    } 
    else{
      let possibleerrors = await reg.register(usrdata);
      if (possibleerrors[3] && !possibleerrors[0] && !possibleerrors[1] && !possibleerrors[2]) {
        res.render('dupeId');
      } else {
        render(req,res,possibleerrors);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/admin', lib.ensureLoggedIn, async (req, res) => {
  try {
    res.render('admin', {loggedIn:req.isAuthenticated()} );
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

  res.render('login');
});

app.get('*', (req, res) => {
  res.render('error', { url: req.url });
});

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
