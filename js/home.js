const keys = Object.keys(imgs);
const div = document.getElementById('scroll-content');
function randomize() {
	let selected = [];
	div.innerHTML = '';
	while (selected.length < 50) {
		let rand = Math.floor(Math.random() * (keys.length - 1));
		if (!selected.includes(keys[rand])) selected.push(keys[rand]);
	}
	for (let z = 0; z < 2; z++)
		for (let ch of selected) {
			let capitalized = ch[0].toUpperCase() + ch.slice(1);
			div.appendChild(elt('a', { href: `characters/${ch}/`, tabIndex: "-1", },
				elt('img', { src: imgs[ch].slice(1), alt: capitalized, title: capitalized })
			));
		}
}
randomize();
function elt(type, props, ...children) {
	let dom = document.createElement(type);
	if (props) Object.assign(dom, props);
	for (let child of children) {
		if (typeof child == "string") dom.appendChild(document.createTextNode(child));
		else dom.appendChild(child);
	}
	return dom;
}