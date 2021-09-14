// Define schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	text: String,
	username: String,
	time: String
});

// Compile model from schema
const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
