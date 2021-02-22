'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');

const routes = require('./routes')
const auth = require('./auth')

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'pug')

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Database connection
myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');

  // Right after you establish a successful connection with the database, instantiate routes and auth like so:
  routes(app, myDataBase);
  auth(app, myDataBase);

  // Socket io listen with "on" inside our DB connection
  
  let currentUsers = 0
  //Handel a user connecting
  io.on('connection', (socket) => {
    ++currentUsers
    io.emit('user count', currentUsers)
    console.log('A user has connected');
  //Handel a user disconnecting
  socket.on('disconnect', () => {
    console.log('A user has disconnected');
    --currentUsers;
    io.emit('user count', currentUsers);
  });
});

  // Catch Errors
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to login' });
  });
});

// App.listen -> HTTP.listen
http.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT);
});