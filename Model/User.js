// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	displayName: String,
	username: String,
	password: String,
	token: String,
	isAdmin: Boolean
});

// Compile model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;
