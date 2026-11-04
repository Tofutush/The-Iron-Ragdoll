(function () {
	let lightDark = localStorage.getItem('light-dark');
	if (!lightDark) return;
	lightDark = parseInt(lightDark);
	if (lightDark === 0) document.documentElement.className = 'dark';
	if (lightDark === 1) document.documentElement.className = 'light';
})();