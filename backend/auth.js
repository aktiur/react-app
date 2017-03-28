passport = require('passport');
LocalStrategy = require('passport-local');

const apiClient = require('./models');

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (userId, done) {
  apiClient.people.get(userId)
    .catch(done)
    .then((user) => done(null, user));
});

passport.use('local',new LocalStrategy(
  function(userid, password, done) {
    apiClient.people.find({email: userid})
      .then(function(users) {
      if(users.length === 0) {
        return done(null, false);
      }
      return done(null, users[0]);
    }).catch(done);
  }
));

exports.authenticateRoute = [
  passport.authenticate('local', {}),
  function(req, res) {
    res.send('OK');
  }
];
