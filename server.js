// require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const session = require('express-session');
const server = http.createServer(app);
const cookieparser = require('cookie-parser');
const flash = require('connect-flash');
// Importing socket IO
const { Server } = require('socket.io');
const io = new Server(server);

// Mongoose
const mongoose = require('mongoose');
const User = require('./Model/User');
const Message = require('./Model/Message');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;
const authRoutes = require('./Routes/authRoutes');
const apiRoutes = require('./Routes/apiRoutes');

const OnlineUsers = require('./Utils/onlineUsers');
const onlineUsers = require('./Utils/onlineUsers');
app.set('view engine', 'ejs');
app.set('json spaces', 4);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('bawdog1234xD69'));
app.use(
	session({
		secret: 'someDogeSecret1234Baw',
		cookie: { maxAge: 60000 },
		resave: true,
		saveUninitialized: true
	})
);
app.use(flash());
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const isLoggedIn = (req, res, next) => {
	const user = req.signedCookies['user'];
	// check cookie against database
	if (!user) {
		res.locals.errorMsgs = req.flash('error');
		res.locals.successMsgs = req.flash('success');
		console.log('user not logged in!');
		return res.render('auth');
	}
	req.user = user;
	next();
	// check cookie
};

app.get('/', isLoggedIn, (req, res, next) => {
	Message.find()
		.limit(100)
		.select('-_id -__v')
		.then((doc) => {
			console.log(doc);
			let onlineNames = [];

			onlineUsers.forEach((usr) => {
				onlineNames.push(usr);
			});

			res.render('index', {
				usr: req.user,
				messages: doc
			});
		});
	console.log(req.user);
});

app.get('/logout', (req, res, next) => {
	const user = req.signedCookies['user'];
	res.cookie('user', '', {
		expires: new Date(Date.now()),
		httpOnly: true,
		signed: true
	});

	req.user = null;
	res.redirect('/');
	console.log(user, 'logged out');
});

/* Socket IO */
// Handle socket events.
// socket.on (event)
// io.emit to send to all; socket.broadcast.emit('hi'); // except user

io.on('connection', (socket) => {
	socket.on('userJoin', (username) => {
		socket.username = username;
		onlineUsers.set(socket.id, username);
		io.emit('join', username);
	});

	socket.on('disconnect', (user) => {
		onlineUsers.delete(socket.id);
		console.log(onlineUsers);
		io.emit('leave', socket.username);
	});

	socket.on('message', (message) => {
		let now = new Date();
		const options = {
			hour: '2-digit',
			minute: '2-digit',
			weekday: 'long',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		};
		let time = now.toLocaleTimeString('en-US', options);
		Message.create({
			text: message.text,
			username: message.user,
			time: time,
			type: 'msg'
		})
			.then((doc) => {
				console.log(doc);
				io.emit('new-message', doc);
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
