const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const formLogin = document.getElementById('formLogin');
const formRegister = document.getElementById('formRegister');

showSignup.addEventListener('click', () => {
	// remove hidden from form register
	// add hidden to form login
	// formLogin.classList.add('hidden');
	// formRegister.classList.remove('hidden');

	$(formLogin).hide('fast', function () {
		$(formRegister).show('slow');
	});
});

showLogin.addEventListener('click', () => {
	// formRegister.classList.add('hidden');
	// formLogin.classList.remove('hidden');

	$(formRegister).hide('fast', function () {
		$(formLogin).show('slow');
	});
});

let windowsize = $(window).width();

$(window).resize(function () {
	windowsize = $(window).width();
	if (windowsize < 640) {
		$(formRegister).hide('slow', () => {
			$(formLogin).show('slow');
		});
	} else {
		$(formLogin).show('slow', () => {
			$(formRegister).show('slow');
		});
	}
});
