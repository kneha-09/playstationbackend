const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        type: String,
        required: true
    }]
});

// Create and export User model
const User = mongoose.model('User', userSchema); // Changed model name to singular ('User')
module.exports = User;
