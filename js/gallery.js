(function () {
	let viewing = false;
	let currentIdx = 0;
	let modal = document.querySelector('#modal');
	let modalImg = modal.querySelector('img');
	let prev = modal.querySelector('.prev');
	let next = modal.querySelector('.next');

	modal.querySelector('.close').addEventListener('click', e => {
		modal.style.display = 'none';
		modal.querySelector('img').src = '';
		document.body.style.overflow = 'auto';
		viewing = false;
	});
	prev.addEventListener('click', e => {
		showImg(currentIdx - 1);
	});
	next.addEventListener('click', e => {
		showImg(currentIdx + 1);
	});

	let author = modal.querySelector('.author');
	let chButtons = modal.querySelector('.tags.chbuttons');
	let info = modal.querySelector('.name-date');
	let comment = modal.querySelector('.comment');
	let images = document.querySelectorAll('.img');
	for (let z = 0; z < images.length; z++) {
		images[z].querySelector('button').addEventListener('click', e => {
			if (viewing) return;
			showImg(z);
		});
	}

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
		modal.style.display = 'flex';
		document.body.style.overflow = 'hidden';
		viewing = true;
	}
})();
