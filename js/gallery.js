(function () {
	let viewing = false;
	let modal = document.querySelector('#modal');
	let author = modal.querySelector('.author');
	let chButtons = modal.querySelector('.tags.chbuttons');
	let info = modal.querySelector('.name-date');
	let comment = modal.querySelector('.comment');
	let close = modal.querySelector('.close');
	let prev = modal.querySelector('.prev');
	let next = modal.querySelector('.next');
	let images = document.querySelectorAll('.img');
	for (let z = 0; z < images.length; z++) {
		let button = images[z].querySelector('button');
		button.addEventListener('click', e => {
			if (viewing) return;
			modal.querySelector('img').src = button.getAttribute('data-url');
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
