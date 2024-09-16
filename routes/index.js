var express = require('express');
const Job = require('../models/job');
var mongoose = require('mongoose');
var router = express.Router();
const Application =require('../models/application')
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { req } = require('http');
const { token } = require('morgan');


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads'); // Use an absolute path
      cb(null, uploadDir); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Set filename with timestamp
  }
});

const upload = multer({ storage: storage });

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  // Assuming you're using JWT for authentication
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.redirect('/login-signup'); // Redirect to login if no token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect('/login-signup'); // Redirect if token is invalid
    req.user = user;
    next();
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index');
});


router.get('/index', function(req, res, next) {
  res.render('index');
});


router.get('/error', function(req, res, next) {
  res.render('error');
});

// Profile page route
// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login-signup');
}


// Profile Route: Only accessible if logged in
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});





router.get('/job', function(req, res, next) {
  res.render('job-post');
});

// router.get('/apply', async function(req, res, next) {
//   try {
//       const jobID = req.query.JobID;  // Ensure propertyID is defined
//       console.log(jobID)
//       const job = await Job.findById(jobID);
//       res.render('apply', { jobs: job });
//   } catch (err) {
//       console.error("Error fetching job:", err);
//       res.status(500).json({ error: err.message });
//   }
// });


router.get('/apply/:id', async (req, res) => {
  try {
    console.log('hello');
    const jobId = req.params.id.replace(":", ""); // Sanitize the ID by removing any extra colon

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).send('Invalid Job ID');
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).send('Job not found');
    }

    res.render('apply', { job });
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).send('Error fetching job details');
  }
});



// POST: Submit a Job Application
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
      const { name, email, jobId } = req.body; // Fetch jobId from req.body

      // Create new job application
      const newApplication = new Application({
          name,
          email,
          resume: req.file.filename, // Resume file path
          jobId
      });

      await newApplication.save();
      res.redirect('/'); // Redirect after success
  } catch (err) {
      console.error(err);
      res.status(500).send('Error submitting application');
  }
});


// Register Route
router.get('/login-signup', (req, res) => {
  res.render('login-signup');
});





// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, mobile, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, mobile, password: hashedPassword });
        await newUser.save();
        res.render('index',{newUser});
        // res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login Route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login-signup'); // Redirect if login fails

    req.login(user, (err) => { // This establishes the session
      if (err) return next(err);
      return res.redirect('/profile'); // Redirect after login
    });
  })(req, res, next);
});





// Protected Route Example
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
