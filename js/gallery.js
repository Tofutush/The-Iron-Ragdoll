(function () {
	let viewing = false;
	let currentIdx = 0;
	let modal = document.querySelector('#modal');
	let modalImg = modal.querySelector('img');
	let prev = modal.querySelector('.prev');
	let next = modal.querySelector('.next');
	prev.addEventListener('click', prevImg);
	next.addEventListener('click', nextImg);

	let author = modal.querySelector('.author');
	let chButtons = modal.querySelector('.tags.chbuttons');
	let info = modal.querySelector('.name-date');
	let comment = modal.querySelector('.comment');
	let images = document.querySelectorAll('.img');
	for (let z = 0; z < images.length; z++) {
		images[z].querySelector('button').addEventListener('click', e => {
			if (viewing) return;
			showImg(z);
			modal.style.display = 'flex';
			document.body.style.overflow = 'hidden';
			modal.querySelector('.close').focus();
			viewing = true;
		});
	}

	modal.addEventListener('keydown', e => {
		if (e.key === 'ArrowLeft') prevImg();
		if (e.key === 'ArrowRight') nextImg();
		if (e.key === 'Escape') closeModal();
		if (e.key === 'Tab') {
			let focusable = modal.querySelectorAll('button, a');
			let first = focusable[0];
			let last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else if (document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	});
	modal.querySelector('.close').addEventListener('click', closeModal);

	function showImg(idx) {
		currentIdx = idx;
		if (idx == 0) prev.disabled = true;
		else prev.disabled = false;
		if (idx == images.length - 1) next.disabled = true;
		else next.disabled = false;
		let button = images[idx].querySelector('button');
		// load img
		let src = button.getAttribute('data-url');
		modalImg.style.opacity = 0;
		let loader = new Image();
		loader.src = src;
		loader.onload = () => {
			modalImg.src = src;
			modalImg.style.opacity = 1;
		};
		// fill info
		if (button.getAttribute('data-author')) {
			author.querySelector('a').href = button.getAttribute('data-authorUrl');
			author.querySelector('a').innerText = button.getAttribute('data-author');
			author.style.display = 'block';
		} else author.style.display = 'none';
		if (button.getAttribute('data-ch')) {
			chButtons.innerHTML = button.getAttribute('data-ch');
			chButtons.style.display = 'flex';
		} else chButtons.style.display = 'none';
		info.children[0].innerText = button.getAttribute('data-name');
		info.children[1].innerText = button.getAttribute('data-date');
		if (button.getAttribute('data-comment')) {
			comment.innerHTML = button.getAttribute('data-comment');
			comment.style.display = 'block';
		} else comment.style.display = 'none';
	}
	function prevImg() {
		if (currentIdx - 1 >= 0) showImg(currentIdx - 1);
	}
	function nextImg() {
		if (currentIdx + 1 < images.length) showImg(currentIdx + 1);
	}
	function closeModal() {
		modal.style.display = 'none';
		modal.querySelector('img').src = '';
		document.body.style.overflow = 'auto';
		viewing = false;
		images[currentIdx].querySelector('button').focus();
	}
})();
