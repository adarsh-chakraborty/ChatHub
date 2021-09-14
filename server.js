require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Importing socket IO
const { Server } = require('socket.io');
const io = new Server(server);

// Mongoose
const mongoose = require('mongoose');
const User = require('./Model/User');
const Message = require('./Model/Message');

const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res, next) => {
	res.render('index');
});

/* Socket IO */
// Handle socket events.
// socket.on (event)
// io.emit to send to all; socket.broadcast.emit('hi'); // except user

io.on('connection', (socket) => {
	socket.on('userJoin', (user) => {
		io.emit('join', user);
		socket.username = user;
	});

	socket.on('disconnect', (user) => {
		io.emit('leave', socket.username);
	});

	socket.on('message', (message) => {
		let now = new Date();
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		let time = now.toLocaleDateString('en-US', options);
		Message.create({ text: 'Hello', username: 'Adarsh', time: time })
			.then((doc) => {
				console.log(doc);
				io.emit('new-message', message);
			})
			.catch((err) => console.log(err));
	});
});

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to mongo db. Starting server...');

		server.listen(PORT, () => {
			console.log('listening on *:' + PORT);
		});
	})
	.catch((err) => console.log(err));
