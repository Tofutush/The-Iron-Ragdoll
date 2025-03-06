(function () {
	let images = document.querySelectorAll('.img');
	for (let z = 0; z < images.length; z++) {
		let img = images[z].querySelector('img');
		let modal = images[z].querySelector('.modal');
		let close = modal.querySelector('.close');
		img.addEventListener('click', e => {
			modal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
		});
		close.addEventListener('click', e => {
			modal.style.display = 'none';
			document.body.style.overflow = 'auto';
		});
	}
})();