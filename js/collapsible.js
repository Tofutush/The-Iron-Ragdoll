// let collapsible = document.getElementsByClassName("collapsible");
// let contents = document.getElementsByClassName('collapsible-content');
// for(let i = 0; i < collapsible.length; i++) {
// 	collapsible[i].addEventListener("click", function() {
// 		this.classList.toggle("collapsible-active");
// 		var content = contents[i];
// 		if (content.style.maxHeight){
// 			content.style.maxHeight = null;
// 		} else {
// 			content.style.maxHeight = content.scrollHeight + "px";
// 		}
// 	});
// }
class Collapsible {
	constructor(div, content) {
		this.div = div;
		this.content = content;
		this.click();
	}
	click() {
		this.div.addEventListener('click', e => {
			this.content.classList.toggle('collapsible-active');
			// if (this.content.style.maxHeight) {
			// 	this.content.style.maxHeight = null;
			// } else {
			// 	this.content.style.maxHeight = this.content.scrollHeight + 'px';
			// }
		})
	}
}
(function () {
	let collapsible = document.getElementsByClassName('collapsible');
	let list = [];
	for (let z = 0; z < collapsible.length; z++) {
		let content = document.querySelector(collapsible[z].getAttribute('target'));
		list.push(new Collapsible(collapsible[z], content));
	}
})();