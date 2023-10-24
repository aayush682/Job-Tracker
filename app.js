// Import required modules
require('dotenv').config(); // Load environment variables from .env file
require('./db/connection'); // Import database connection module
const express = require('express'); // Import Express framework
const cookieParser = require('cookie-parser'); // Import cookie parser module
const path = require('path'); // Import path module for file paths
const PORT = process.env.PORT || 5000; // Set the server port
const authRoutes = require('./routes/authRoutes'); // Import authentication routes module
const jobsRoutes = require('./routes/jobsRoutes'); // Import jobs routes module
const bodyParser = require('body-parser'); // Import body parser module

const app = express(); // Create Express app


// Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use(authRoutes); // Use authentication routes
app.use(jobsRoutes); // Use jobs routes

// Public folder
const public = path.join(__dirname, './public'); // Set the path to the public folder
app.use(express.static('public')); // Serve static files from the public folder

// Set up view engine and views directory
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.set('views', path.join(__dirname, './views/pages')); // Set the path to the views directory

// Set up EJS partials
const partialsPath = path.join(__dirname, './views/layouts'); // Set the path to the partials directory
app.set('view-options', { partials: partialsPath }); // Set the view options to include partials

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`); // Start the server and log the URL
});