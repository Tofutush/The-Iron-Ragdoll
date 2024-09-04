// see image
let divs = document.getElementById('gallery').children;
// tags
let filter = [];
let tags = document.querySelector('.tags').children;
for(let z = 0; z < tags.length; z++) {
	tags[z].addEventListener('click', e => {
		if(tags[z].classList.contains('active')) {
			tags[z].classList.remove('active');
			filter.splice(filter.indexOf(tags[z].getAttribute('name')), 1);
		} else {
			if(e.shiftKey) {
				tags[z].classList.add('active');
				filter.push(tags[z].getAttribute('name'));
			} else {
				for(let x = 0; x < tags.length; x++) {
					tags[x].classList.remove('active');
				}
				tags[z].classList.add('active');
				filter = [tags[z].getAttribute('name')];
			}
		}
		filterImgs()
	});
}
function filterImgs() {
	for(let z = 0; z < divs.length; z++) {
		if(filter.every(f => divs[z].classList.contains(f))) {
			divs[z].classList.remove('hidden');
		} else {
			divs[z].classList.add('hidden');
		}
	}
}