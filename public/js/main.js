const socket = io.connect('/');

const chatBox = document.getElementById('chatBox');
const btnSend = document
	.getElementById('btnSend')
	.addEventListener('click', () => {
		socket.emit('message', { user: 'Adarsh', text: 'Hello', time: '2 April' });
	});

// socket.emit to emit a event.
// socket.on to receive an event.

socket.emit('userJoin', 'Adarsh');

socket.on('join', (text) => {
	const div = document.createElement('div');
	div.classList.add('p-2');
	div.innerHTML = `
	<div class="p-2 text-gray-900 tracking-tighter font-mono border-l-4 border-green-800 bg-green-100">
		<span class="">Adarsh has joined the ChatHub!</span>
	</div>
	`;

	chatBox.appendChild(div);
	$('#chatBox').animate(
		{
			scrollTop: chatBox.scrollHeight
		},
		500
	);
});

socket.on('leave', (user) => {
	const div = document.createElement('div');
	div.classList.add('p-2');
	div.innerHTML = `
	<div class="p-2 text-gray-900 tracking-tighter font-mono border-l-4 border-red-700 bg-red-100">
        <span class="">${user} has left the chat.</span>
    </div>
	`;

	chatBox.appendChild(div);
	$('#chatBox').animate(
		{
			scrollTop: chatBox.scrollHeight
		},
		500
	);
});

socket.on('new-message', (message) => {
	const div = document.createElement('div');
	div.classList.add('p-2');
	div.innerHTML = `
	<div class="text-xs">
         <span class="text-sm font-semibold">${message.user}</span> <span class="opacity-50">${message.time}</span>
      </div>
      <div class="p-2 bg-gray-200 rounded-md">${message.text}
    </div>
	`;

	chatBox.appendChild(div);
	$('#chatBox').animate(
		{
			scrollTop: chatBox.scrollHeight
		},
		500
	);
});

function say(text) {
	var msg = new SpeechSynthesisUtterance();
	var voices = window.speechSynthesis.getVoices();
	msg.voice = voices[10];
	msg.voiceURI = 'native';
	msg.volume = 1;
	msg.rate = 1;
	msg.pitch = 0.8;
	msg.text = text;
	msg.lang = 'en-US';
	speechSynthesis.speak(msg);
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
