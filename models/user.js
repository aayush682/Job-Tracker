const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


// Generate a token
userSchema.methods.generateAuthToken = async function () {
    try {
        // Create a token using the user's ID and the JWT secret
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);

        // Add the token to the user's tokens array
        this.tokens = this.tokens.concat({ token });

        // Save the updated user document to the database
        await this.save();

        // Return the generated token
        return token;
    } catch (error) {
        // Log any errors that occur during token generation
        console.log(error);
    }
}

// Hash the password before saving
userSchema.pre('save', async function (next) {
    // Check if the password field has been modified or if it's a new user
    if (!this.isModified('password') || !this.isNew) {
        next(); // If not modified or not new, skip to the next middleware
    }

    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    next(); // Continue to the next middleware
})

const User = mongoose.model('User', userSchema);

module.exports = User;