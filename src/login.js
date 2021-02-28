const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const lib = require('./users');


passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await lib.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

async function strat(username, password, done) {
  try {
    const user = await lib.findByUsername(username);
    if (!user) {
      return done(null, false);
    }
    const result = await lib.comparePasswords(password, user);
    return done(null, result);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}



module.exports = { ensureLoggedIn, strat };
