(function () {
	let galleries = document.querySelectorAll('.gallery');
	for (gallery of galleries) {
		let divs = gallery.children;
		for (let z = 0; z < divs.length; z++) {
			let img = divs[z].querySelector('img');
			img.addEventListener('click', e => {
				let modal = divs[z].querySelector('.modal');
				let close = modal.querySelector('.close');
				modal.style.display = 'flex';
				document.body.style.overflow = 'hidden';
				close.addEventListener('click', e => {
					modal.style.display = 'none';
					document.body.style.overflow = 'auto';
				});
			});
		}
	}
})();