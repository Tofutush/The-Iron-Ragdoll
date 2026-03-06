(function () {
	let viewing = false;
	let images = document.querySelectorAll('.img');
	for (let z = 0; z < images.length; z++) {
		let thumb = images[z].querySelector('.thumb');
		let modal = images[z].querySelector('.modal');
		let close = modal.querySelector('.close');
		let prev = modal.querySelector('.prev');
		let next = modal.querySelector('.next');
		thumb.addEventListener('click', e => {
			if (viewing) return;
			modal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
			viewing = true;
		});
		close.addEventListener('click', e => {
			modal.style.display = 'none';
			document.body.style.overflow = 'auto';
			viewing = false;
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
