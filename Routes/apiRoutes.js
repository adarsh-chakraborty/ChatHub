const express = require('express');
const router = express.Router();
const onlineUsers = require('../Utils/onlineUsers');

router.get('/online', (req, res, next) => {
	const users = [];
	for (usr of onlineUsers.values()) {
		users.push(usr);
	}

	res.json(users);
});

module.exports = router;
