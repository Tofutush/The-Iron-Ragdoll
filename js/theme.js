(function () {
	let toggle = document.querySelector('.theme-toggle');
	let lightDark = parseInt(localStorage.getItem('light-dark'));
	toggle.addEventListener('click', e => {
		if (lightDark === 0) {
			lightDark = 1;
			document.documentElement.className = 'light';
		} else {
			lightDark = 0;
			document.documentElement.className = 'dark';
		}
		localStorage.setItem('light-dark', lightDark);
	});
})();