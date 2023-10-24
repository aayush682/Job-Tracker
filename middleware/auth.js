// Import the necessary modules
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Define an async middleware function called 'auth'
const auth = async (req, res, next) => {
    try {
        // Extract the JWT token from the request cookies
        const token = req.cookies.jwt;

        // Verify the JWT token using the secret key
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user with the matching ID in the database
        const user = await User.findOne({ _id: verifyUser._id });

        // If a user is found, set the user and token in the request object and call the next middleware function
        if (user) {
            req.user = user;
            req.token = token;
            next();
        }
    } catch (error) {
        // Redirect to the login page if the JWT token is invalid or expired
        res.status(201).redirect('/');
    }
}

// Export the 'auth' middleware function
module.exports = auth;