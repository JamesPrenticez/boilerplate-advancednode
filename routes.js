const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, myDataBase) {
  // Main Route
  app.route('/').get((req, res) => {
    // Change the response to render the Pug template
    res.render('pug', {
      title: 'Connected to Database',
      message: 'Please login',
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true
    });
  });

  //Login Route - redirects to slash on fail and profile when success
  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

  //Profile Route
  //Call ensureAuthenticated middleware on the profile route
  app.route('/profile').get(ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + '/views/pug/profile', { username: req.user.username });
  });

  //Chat Route
  app.route('/chat').get(ensureAuthenticated, (req, res) => {
    res.render('/views/pug/chat', { user: req.user });
  });

  //Logout Route
  //Redirects to homepage
  app.route('/logout')
  .get((req, res) => {
    //In passport, unauthenticating a user is as easy as just calling req.logout(); before redirecting.
    req.logout();
    res.redirect('/');
  });

  //Register Route
  app.route('/register')
    .post((req, res, next) => {
      const hash = bcrypt.hashSync(req.body.password, 12);
      myDataBase.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
          next(err);
        } else if (user) {
          res.redirect('/');
        } else {
          myDataBase.insertOne({ username: req.body.username, password: hash }, (err, doc) => {
              if (err) {
                res.redirect('/');
              } else {
                // The inserted document is held within
                // the ops property of the doc
                next(null, doc.ops[0]);
              }
            }
          )
        }
      })
    },
      passport.authenticate('local', { failureRedirect: '/' }),
      (req, res, next) => {
        res.redirect('/profile');
      }
    );

  //Git Hub Authentication Route 
  app.route('/auth/github').get(passport.authenticate('github'));
  app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    req.session.user_id = req.user.id;
    res.redirect('/chat');
  });

  //404 Not Found Handler
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
}

//Middleware to ensureAthenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}