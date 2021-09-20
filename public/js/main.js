const activeUsers = document.getElementById('onlineUsers');

const audio = new Audio('/assets/audio.mp3');

const user = document.cookie;
console.log(user);
const socket = io.connect('/');

const refreshActiveUsers = () => {
	console.log('refreshing active users');
	fetch('/api/online')
		.then((usrs) => {
			return usrs.json();
		})
		.then((usrs) => {
			let ustring = usrs.reduce((acc, curr, at, arr) => {
				acc += curr;
				if (at + 1 != arr.length) acc += ',';
				return acc;
			}, '');
			activeUsers.innerText = `Online users(${usrs.length}): ${ustring}`;
		})
		.then((users) => {
			console.log(users);
		});
};

const chatBox = document.getElementById('chatBox');
const inputBox = document.getElementById('msg');

const sendNewMessage = () => {
	socket.emit('message', { user: userName2, text: inputBox.value });
	inputBox.value = '';
	inputBox.focus();
};

inputBox.addEventListener('keyup', ({ key }) => {
	if (key === 'Enter') {
		sendNewMessage();
	}
});
const btnLogout = document.getElementById('logout');
const btnSend = document
	.getElementById('btnSend')
	.addEventListener('click', sendNewMessage);

// socket.emit to emit a event.
// socket.on to receive an event.

socket.emit('userJoin', userName2);

socket.on('join', (usrName) => {
	const div = document.createElement('div');
	div.classList.add('p-2');
	div.innerHTML = `
	<div class="p-2 text-gray-900 tracking-tighter font-mono border-l-4 border-green-800 bg-green-100">
		<span class="">${usrName} has joined the ChatHub!</span>
	</div>
	`;

	$(div).appendTo(chatBox).hide().fadeIn('slow');
	$('#chatBox').animate(
		{
			scrollTop: chatBox.scrollHeight
		},
		500
	);

	refreshActiveUsers();

	try {
		audio.play();
	} catch (e) {
		console.log(e.message);
	}
});

socket.on('leave', (usr) => {
	const div = document.createElement('div');
	div.classList.add('p-2');
	div.innerHTML = `
	<div class="p-2 text-gray-900 tracking-tighter font-mono border-l-4 border-red-700 bg-red-100">
        <span class="">${usr} has left the chat.</span>
    </div>
	`;

	$(div).appendTo('#chatBox').hide().show();
	$('#chatBox').animate(
		{
			scrollTop: chatBox.scrollHeight
		},
		500
	);
	refreshActiveUsers();
});

socket.on('new-message', (message) => {
	const div = document.createElement('div');
	div.classList.add('p-2');
	div.innerHTML = `
	<div class="text-xs">
         <span class="text-sm font-semibold">${message.username}</span> <span class="opacity-50">${message.time}</span>
      </div>
      <div class="p-2 bg-gray-200 rounded-md">${message.text}
    </div>
	`;

	$(div).appendTo('#chatBox').hide().show();
	$('#chatBox').animate(
		{
			scrollTop: chatBox.scrollHeight
		},
		500
	);
});

function say(text) {
	let msg = new SpeechSynthesisUtterance();
	let voices = window.speechSynthesis.getVoices();
	msg.voice = voices[10];
	msg.voiceURI = 'native';
	msg.volume = 1;
	msg.rate = 1;
	msg.pitch = 0.8;
	msg.text = text;
	msg.lang = 'en-US';
	speechSynthesis.speak(msg);
}

btnLogout.addEventListener('click', () => {
	clearCookie();
	location.reload();
});

function clearCookie(name, domain, path) {
	console.log(document.cookie);
	document.cookie =
		'user=; expires=' + +new Date() + '; domain=' + document.domain;
	+'; path=/';
	console.log(document.cookie);
}

/*
<!-- User Join Card Start -->
<div class="p-2 ">
  <div class="p-2 text-gray-900 tracking-tighter font-mono border-l-4 border-green-800 bg-green-100">
	  <span class="">Adarsh has joined the ChatHub!</span>
  </div>
</div>

<!-- Card End -->

*/
