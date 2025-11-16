import markdownIt from "markdown-it";
import holidays from '../_data/holidays.json' with {type: 'json'};

function utilPlugin(eleventyConfig) {
	const mdRender = new markdownIt();
	eleventyConfig.addFilter('lowerCase', function (s) {
		return s.toLowerCase();
	});
	eleventyConfig.addFilter('upperCase', function (s) {
		return s.toUpperCase();
	});
	eleventyConfig.addFilter('capitalize', function (s) {
		return s[0].toUpperCase() + s.slice(1);
	});
	eleventyConfig.addFilter('sortAlphabetical', function (arr) {
		return arr.sort((a, b) => a.localeCompare(b));
	});
	eleventyConfig.addFilter('padStart', function (n, num, token) {
		return n.toString().padStart(num, token);
	});
	eleventyConfig.addFilter('getMonthName', function (n) {
		return ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][n];
	});
	eleventyConfig.addFilter('to6DigitHex', to6DigitHex);
	eleventyConfig.addFilter('getPaletteBackground', function (colors) {
		let keys = Object.keys(colors);
		return `background-image: linear-gradient(to right, ${to6DigitHex(colors[keys[0]])} 50%, ${to6DigitHex(colors[keys[keys.length - 1]])} 50%)`;
	});
	eleventyConfig.addFilter('calculateBlackWhite', function (color) {
		color = color.substring(1);
		let rgbArr = [
			parseInt(color.substring(0, 2), 16),
			parseInt(color.substring(2, 4), 16),
			parseInt(color.substring(4, 6), 16),
		];
		return Math.round(rgbArr[0] * 299 + rgbArr[1] * 587 + rgbArr[2] * 114) / 1000 > 125 ? '#121212' : '#fff9f2';
	});
	eleventyConfig.addFilter('renderMD', function (rawString) {
		return mdRender.render(rawString);
	});
	eleventyConfig.addFilter('slice', function (str, s, e) {
		return str.slice(s, e ? e : str.length);
	});
	eleventyConfig.addFilter('randomItem', function (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	});
	eleventyConfig.addFilter('getBDayStars', function (arr) {
		let dateMonth = new Date().toISOString().slice(5, 10);
		return arr.filter(ch => ch.attr?.Birth?.substring(5) === dateMonth);
	});
	eleventyConfig.addFilter('getHolidays', function (blah) {
		let dateMonth = new Date().toISOString().slice(5, 10);
		return holidays[dateMonth];
	});
	eleventyConfig.addFilter('getMMDD', function (bleh) {
		return new Date().toISOString().slice(5, 10);
	});
	eleventyConfig.addFilter('toDateObj', function (date) {
		let year = date.slice(0, 4);
		let month = date.slice(5, 7);
		let day = date.slice(8, 10);
		return new Date(year, month - 1, day);
	});
	eleventyConfig.addFilter('between', function (date, start, end) {
		return start <= date && date <= end;
	});
}

function to6DigitHex(hex) {
	if (hex.length < 6) {
		if (hex[0] == '#') hex = hex.substring(1);
		hex = '#' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	return hex;
}

export default utilPlugin;
