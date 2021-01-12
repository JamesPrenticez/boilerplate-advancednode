const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, myDataBase) {
 // Serialization and deserialization
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });
  //Local authentication stratergy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      myDataBase.findOne({ username: username }, function (err, user) {
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        //Add hashing with bcrypt
        if (!bcrypt.compareSync(password, user.password)) { 
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

  //Github authentication stratergy - This won't work on the local host you must run it on a live server
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://advancednode-jamesprenticez.herokuapp.com/auth/github/callback'
  },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile)
      myDataBase.findAndModify(
        { id: profile.id },
        {},
        {
          $setOnInsert: {
            id: profile.id,
            name: profile.displayName || 'John Doe',
            photo: profile.photos[0].value || '',
            email: Array.isArray(profile.emails) ? profile.emails[0].value : 'No public email',
            created_on: new Date(),
            provider: profile.provider || ''
          },
          $set: {
            last_login: new Date()
          },
          $inc: {
            login_count: 1
          }
        },
        { upsert: true, new: true },
        (err, doc) => {
          return cb(null, doc.value)
        }
      )
    }
  ))
}