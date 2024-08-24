// see image
let divs = document.getElementById('gallery').children;
// let modals = document.getElementById('modals').children;
for(let z = 0; z < divs.length; z++) {
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
function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}
