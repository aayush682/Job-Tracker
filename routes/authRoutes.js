const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Auth = require('../middleware/auth');

const oneDay = 1000 * 60 * 60 * 24;

// Render the home page
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        isAuthenticated: req.user,
    })
})

// Render the login page
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        isAuthenticated: req.user
    });
})

// Render the register page
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        isAuthenticated: req.user
    });
})

// Logout the user
router.get("/logout", Auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie('jwt');
        await req.user.save();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        // Create a new User object with the provided email, name, and password
        const user = new User({ name, email, password });
        // Generate an authentication token for the user
        const token = await user.generateAuthToken();
        // Set the JWT token as a cookie with an expiry date of one day and make it accessible only via HTTP
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + oneDay),
            httpOnly: true
        })
        // Save the user to the database
        await user.save();
        // Redirect the user to the login page
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
})

// Login with user credentials
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find a user in the database with the provided email
        const user = await User.findOne({ email });
        if (user) {
            // Compare the provided password with the user's stored password
            const isMatch = await bcrypt.compare(password, user.password);

            // Generate a new authentication token for the user
            const token = await user.generateAuthToken();
            // Set the JWT token as a cookie with an expiry date of one day and make it accessible only via HTTP
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + oneDay),
                httpOnly: true
            })

            if (isMatch) {
                // Redirect the user to the jobs page if the password is valid
                res.redirect('/jobs');
            } else {
                // Return an error response if the password is invalid
                res.status(400).json({
                    message: 'Invalid Credentials',
                    type: 'error'
                });
            }
        } else {
            // Return an error response if the user is not found
            res.status(400).json({
                message: 'Invalid Credentials',
                type: 'error'
            });
        }
    } catch (error) {
        console.log(error);
        // Return an error response if an error occurs during the login process
        res.status(400).json({
            message: 'User not found',
            type: 'error'
        })
    }
})

module.exports = router