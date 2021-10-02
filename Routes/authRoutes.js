const express = require('express');
const Router = express.Router();
const User = require('../Model/User');

Router.post('/register', (req, res, next) => {
	const { username, password } = req.body;
	console.log(req.body);
	if (!username || !password)
		return res.send('Please provide all the required details!');
	if (!username.trim().length > 0 || !password.trim().length > 0) {
		return res.send('Enter all the required values!');
	}
	let displayName = username;
	User.findOne({ username: username }).then((doc) => {
		if (doc) {
			console.log('User already exists!');
			req.flash(
				'error',
				`Username ${username} is taken! Choose a different one.`
			);
			return res.redirect('/');
		}

		User.create({
			displayName,
			username,
			password,
			token: null,
			isAdmin: false
		})
			.then(() => {
				console.log('user created!');
				req.flash(
					'success',
					`Success! Your account has been created, Login now...`
				);
				return res.redirect('/');
			})
			.catch((error) => {
				req.flash('error', 'Something went wrong.. try again!');
				res.redirect('/');
			});
	});
});

Router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	console.log(req.body);
	if (!username || !password)
		return res.send('Please provide all the required details!');
	if (!username.trim().length > 0 || !password.trim().length > 0) {
		return res.send('Enter all the required values!');
	}

	User.findOne({ username: username }).then((doc) => {
		if (!doc) {
			console.log("This username isn't registered.");
			req.flash('error', `User ${username} is not registered.`);
			return res.redirect('/');
		}
		let options = {
			maxAge: 1000 * 60 * 15, // would expire after 15 minutes
			httpOnly: true, // The cookie only accessible by the web server
			signed: true // Indicates if the cookie should be signed
		};

		if (doc.password !== password) {
			req.flash('error', `Invalid username or password.`);
			return res.redirect('/');
		}
		// login
		res.cookie('user', doc.displayName, options);
		res.redirect('/');
	});
});

module.exports = Router;
