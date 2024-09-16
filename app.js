require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;  // Import LocalStrategy from passport-local
const flash = require('connect-flash');
const User = require('./models/user');
require('dotenv').config();  // For environment variables
require('./config/connectdatabse');
const postRoutes = require('./routes/job');
const applyroutes = require('./routes/applyroutes');
var cookieParser = require('cookie-parser');


const app = express();

app.set('view engine', 'ejs');

app.use(cookieParser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ** Fix for the express-session deprecation warning **
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 360000000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Passport configuration
passport.use(new LocalStrategy(
    { usernameField: 'email' },  // Configure to use 'email' as the username field
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });  // Change to find by email
            if (!user) return done(null, false, { message: 'Incorrect email' });
            const isMatch = await user.comparePassword(password);
            if (!isMatch) return done(null, false, { message: 'Incorrect password' });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id); // Storing user id in session
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Fetching the user from the database
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/apply',applyroutes);
app.use('/job', postRoutes);


// Set the port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;