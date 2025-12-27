(function () {
	let images = document.querySelectorAll('.img');
	for (let z = 0; z < images.length; z++) {
		let img = images[z].querySelector('img');
		let modal = images[z].querySelector('.modal');
		let close = modal.querySelector('.close');
		let prev = modal.querySelector('.prev');
		let next = modal.querySelector('.next');
		img.addEventListener('click', e => {
			modal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
		});
		close.addEventListener('click', e => {
			modal.style.display = 'none';
			document.body.style.overflow = 'auto';
		});
		if (z === 0) prev.classList.add('noclick');
		else prev.addEventListener('click', e => {
			images[z - 1].querySelector('.modal').style.display = 'flex';
			modal.style.display = 'none';
		});
		if (z === images.length - 1) next.classList.add('noclick');
		else next.addEventListener('click', e => {
			images[z + 1].querySelector('.modal').style.display = 'flex';
			modal.style.display = 'none';
		});
	}
})();