// (function() {
// 	let palette = document.querySelector('.palette').children;
// 	if(!palette) return;
// 	for(let z = 0; z < palette.length; z++) {
// 		let bg = hexTo6Digit(palette[z].style.backgroundColor);
// 		color = hexToRgb(bg);
// 		let brightness = Math.round(((parseInt(color[0]) * 299) + (parseInt(color[1]) * 587) + (parseInt(color[2]) * 114)) / 1000);
// 		let c = brightness > 125 ? '#fff' : '#000';
// 		palette[z].children[0].style.color = c;
// 		palette[z].children[0].innerHTML = bg;
// 		console.log(bg, color, );
// 	}
// 	function hexTo6Digit(hex) {
// 		if(hex.length == 4) return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
// 		else return hex;
// 	}
// 	function hexToRgb(hex) {
// 		if (hex[0] == "#") hex = hex.substring(1);
// 		return [
// 			parseInt(hex.substring(0, 2), 16),
// 			parseInt(hex.substring(2, 4), 16),
// 			parseInt(hex.substring(4, 6), 16),
// 		];
// 	};
// })();
class Palette {
	constructor(div) {
		this.colors = div.children;
		this.calcTextColor();
		this.replaceString();
	}
	calcTextColor() {
		for(let z = 0; z < this.colors.length; z++) {
			let rgbStr = this.colors[z].style.backgroundColor;
			let rgbArr = this.getRgbArray(rgbStr);
			let brightness = this.getBrightness(rgbArr);
			let c = brightness > 125 ? '#000' : '#fff';
			this.colors[z].style.color = c;
		}
	}
	replaceString() {
		for(let z = 0; z < this.colors.length; z++) {
			let str = this.colors[z].children[0].children[0];
			let hex = str.innerText;
			if(hex.length < 6) {
				hex = this.hexTo6Digit(hex);
				str.innerText = hex;
			}
		}
	}
	getRgbArray(str) {
		return str.replace(/[^\d,]/g, '').split(',');
	}
	getBrightness(color) {
		return Math.round(((parseInt(color[0]) * 299) + (parseInt(color[1]) * 587) + (parseInt(color[2]) * 114)) / 1000)
	}
	hexTo6Digit(hex) {
		if(hex[0] == '#') hex = hex.substring(1);
		return '#' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
}
(function() {
	let palette = document.querySelector('.palette');
	if(palette) {
		p = new Palette(palette);
	}
})();