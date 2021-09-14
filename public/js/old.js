let user = JSON.parse(localStorage.getItem('localUser')) ?? null;
console.log(user);
if (!user) {
	let name = null;
	while (1) {
		if (name == null || name == '') {
			name = prompt('Enter your name:');
		} else break;
	}
	user = { name: name, message: '' };
	localStorage.setItem('localUser', JSON.stringify(user));
}
const socket = io.connect('/');
socket.emit('userjoin', user);
socket.on('message', (userMsg) => {
	const el = document.createElement('li');
	el.innerHTML = userMsg;
	document.querySelector('ul').appendChild(el);
});
socket.on('userjoin', (text) => {
	const el = document.createElement('li');
	el.innerHTML = text;
	document.querySelector('ul').appendChild(el);
});
document.querySelector('button').onclick = () => {
	const text = document.querySelector('input').value;
	user.message = text;
	socket.emit('message', user);
};
