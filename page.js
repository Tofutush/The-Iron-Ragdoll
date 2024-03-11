// authors notes
const authorsNotes = {
	1: `<p>This is the start of The Iron Ragdoll! Thanks a lot for your willingness to give this a shot!</p>
		<p>The Iron Ragdoll is also available on other platforms (see dropdown menu when hovering "Other" above). It would be so kind of you subscribe and leave comments!</p>`,
	4: `<p>Sparky settles in her new home. She knows it's supposed to be bad, but somehow it's worse.</p>`,
	6: `<p>Okay, so that was like, a <i>really</i> quick representation of Hillslope. There's definitely going to be more stuff besides grass, buildings and a single road. But the important landmarks are there: two apartments, two small house-like things, and an abandoned, broken building.</p>`,
	8: `<p>Don't bother looking; the anklet is covered up by Sparky's huge pant sleeves. This is not an excuse for poor drawing (although the drawing <i>is</i> poor). It's actually her pants.</p>`,
	11: `<p>This page is drawn in Clip Studio Paint. Drawing comics in SAI was horrible. I will eventually redraw the previous ten pages with CSP too, but right now it's too early to be turning back.</p>`,
	17: `<p>When Cosmo asked Sparky whether she could remember names, she wasn't asking Sparky. She was asking <i>you</i>. Can you remember these characters? You will meet more of them.</p>`,
	24: `<p>New day, new shitty problems!`,
	28: `<p>Sparky in the bottom-left panel kinda looks like a gorilla. Sorry guys, I'm still working on it.</p>`,
	32: `<p>This page looks <i>really</i> lazy, doesn't it.</p>`,
	34: `<p>My tablet broke down while drawing "party," and the new one is quite different from the old one and I'm still getting used to it. So I apologize if these pages look weird!</p>`,
	37: `<p>Panel 2, Sparky is snorting lemonade with her nose /j.</p>`,
	50: `<p>Whoa, hey, Tomato lost his ears in the second-to-last panel. Sorry about that.</p>`,
	52: `<p>I can't help but say: Melody is so cool. So cool.</p><p>Also, the laziness is radiating off the last panel. Sorry, let's assume the others have mysteriously shuffled away so that we can only see Sparky and Tephra near the chair.</p>`,
	55: `<p>Wow, Jerboa's arms are awfully long.</p>`,
	57: `<p>Ah, yes, the three fundamental elements of the universe.</p>`,
};
// background stuff
const BGStuff = {
	0: ['forest-night', 'night'],
	11: ['hillslope-night', 'night'],
	24: ['hillslope-day', 'day'],
	35: ['tavern', 'night'],
};
const themes = {
	night: ':root { --text: #fff; }',
	day: `:root { --text: #000; }
		  #header { background-image: none; }
		  #title { text-shadow: none; }
		  .dpdn-ul { background-color: #ffffff80; }`,
}

window.onload = function() {
	window.url = new URLSearchParams(window.location.search);
	window.pagenum = Math.max(0, Number(url.get('page') || 0));
	window.options = document.querySelectorAll('.options');
	// get max page num
	window.maxPageNum = 0;
	let dateString = new Date().toJSON().slice(0, 10);
	for(let z = 0; z < episodes.length; z++) {
		let eps = episodes[z][1];
		let flag;
		for(let x = 0; x < eps.length; x++) {
			// once we hit a date larger than today, break
			if(dateString < eps[x][1]) {
				flag = true;
				break;
			}
			// else, set the maxPageNum and go on
			maxPageNum = eps[x][3] + eps[x][2] - 1;
		}
		if(flag) break;
	}
	// if local, always see all
	if(window.location.href.includes('file:///E:/github/The-Iron-Ragdoll')) {
		let last = episodes[episodes.length - 1][1][episodes[episodes.length - 1][1].length - 1];
		maxPageNum = last[3] + last[2] - 1;
	}
	if(maxPageNum < pagenum) flipPage(0);
	changeNumberInMiddle(pagenum);
	setImage(pagenum);
	changeBG(pagenum);
	addANotes(pagenum);
	pageLinx();
	doNoClicks();
	saveButtons();
	arrowNavigation();
	typeNumberNavigation();
}

function arrowNavigation() {
	document.body.addEventListener('keydown', e => {
		if(e.key == 'ArrowLeft') // left arrow
			this.flipPage('prev');
		if(e.key == 'ArrowRight') // right arrow
			this.flipPage('next');
	});
}

function saveButtons() {
	let save = document.getElementById('save').children;
	save[0].addEventListener('click', e => {
		localStorage.setItem('place', pagenum);
		alert(`Page ${pagenum} saved!`);
	});
	save[1].addEventListener('click', e => {
		let place = localStorage.getItem('place');
		if(place) flipPage(place);
		else alert('no place was saved!');
	});
}

function pageLinx() {
	for(let option of options) {
		a = option.children;
		a[0].addEventListener('click', e => {
			flipPage(0);
		});
		a[1].addEventListener('click', e => {
			flipPage('prev');
		});
		a[3].addEventListener('click', e => {
			flipPage('next');
		});
		a[4].addEventListener('click', e => {
			flipPage(maxPageNum);
		});
	}
}

// flip page without refresh; num can be number or "next" or "prev"
function flipPage(num) {
	if(num == 'next') num = Math.min(maxPageNum, pagenum + 1);
	if(num == 'prev') num = Math.max(0, pagenum - 1);
	if(num == pagenum || !withinRange(num)) return;
	window.history.pushState({}, null, `?page=${num}`);
	location.hash = '#comic'; // scroll to comic
	document.title = `The Iron Ragdoll | Page ${num}`;
	changeNumberInMiddle(num);
	preloadImg(num - 1);
	preloadImg(num + 1);
	setImage(num);
	changeBG(num);
	addANotes(num);
	pagenum = num;
	doNoClicks();
}

function preloadImg(num) {
	let img = new Image();
	img.url = getImgUrl(num);
}

function doNoClicks() {
	for(let option of options) {
		let a = option.children;
		if(pagenum == 0) {
			a[0].className = a[1].className = 'noclick';
		} else {
			a[0].className = a[1].className = '';
		};
		if(pagenum == maxPageNum) {
			a[3].className = a[4].className = 'noclick';
		} else {
			a[3].className = a[4].className = '';
		}
	}
}

function addANotes(num) {
	// authors notes
	let el = document.getElementById('note');
	let note = authorsNotes[num];
	if(note) {
		el.innerHTML = note;
		el.style.display = 'block';
	} else {
		el.style.display = 'none';
	}
	// translation
	// stupid encoding keeps eating my translations.
	// document.getElementById('translation').children[0].innerHTML = translation[num];
}

function changeNumberInMiddle(num) {
	// full fledge single letter variable mode but i dont care
	let q = document.querySelectorAll('.pagenum');
	for(let w of q) {
		w.innerText = num;
	};
}

function typeNumberNavigation() {
	let q = document.querySelectorAll('.pagenum');
	for(let w of q) {
		w.addEventListener('keydown', e => {
			if(e.key == 'Enter') {
				e.preventDefault();
				if(w.innerText.toLowerCase() == 'last') {
					flipPage(maxPageNum);
				} else {
					let n = parseInt(w.innerText);
					if(withinRange(n)) flipPage(n);
					else w.innerText = pagenum;
				}
			}
		});
	}
}

function setImage(num) {
	document.getElementById('img').children[0].src = getImgUrl(num);
}

function changeBG(num) {
	while(!BGStuff[num]) {
		num--;
		if(num < 0 || Number.isNaN(num)) throw new YouAreSoStupidError('num is so wrong maybe its below 0 meybe its not a number');
	}
	document.body.style.backgroundImage = `url(bg/${BGStuff[num][0]}.png)`;
	// let root = document.querySelector(':root');
	// root.style.setProperty('--text', BGStuff[num][1]);
	document.getElementById('theme').innerHTML = themes[BGStuff[num][1]];
}

function getImgUrl(num) {
	return String(Math.floor(num / 100) + '/' + num + '.png');
}

function withinRange(num) {
	return num >= 0 && num <= maxPageNum;
}

// code from Grepper
function clearEventListeners(el) {
	clone = el.cloneNode(true);
	el.parentNode.replaceChild(clone, el);
}

// code from Grepper
class YouAreSoStupidError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		Error.captureStackTrace(this, this.constructor);
	}
}

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}