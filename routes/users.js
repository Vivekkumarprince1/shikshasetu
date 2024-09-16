const express = require('express');
const passport = require('passport');

const router = express.Router();

// Register Route
router.get('/login-signup', (req, res) => {
    res.render('login-signup');
});

router.post('/signup', async (req, res) => {
    try {
        const { username, email,mobile, password } = req.body;
        const newUser = new User({ username, email,mobile, password });
        await newUser.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/login-signup');
    }
});

// Login Route
// router.get('/login', (req, res) => {
//     res.render('login');
// });

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;