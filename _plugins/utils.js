import markdownIt from "markdown-it";
import markdownItExternalLinks from "markdown-it-external-links";
import holidays from '../_data/holidays.json' with { type: 'json' };
import characters from '../_data/characters.json' with { type: 'json' };

function utilPlugin(eleventyConfig) {
	const mdRender = new markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItExternalLinks, {
		externalTarget: '_blank'
	});
	eleventyConfig.addFilter('lowerCase', function (s) {
		return s.toLowerCase();
	});
	eleventyConfig.addFilter('upperCase', function (s) {
		return s.toUpperCase();
	});
	eleventyConfig.addFilter('capitalize', function (s) {
		return s[0].toUpperCase() + s.slice(1);
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
	eleventyConfig.addFilter('getColorName', async function (color) {
		let response = await fetch(`https://api.color.pizza/v1/?values=${to6DigitHex(color).substring(1)}&list=mlmc_english`);
		let json = await response.json();
		console.log(json.colors[0].name);

		return json.colors[0].name;
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
	eleventyConfig.addFilter('toDateObj', function (date) {
		let year = date.slice(0, 4);
		let month = date.slice(5, 7);
		let day = date.slice(8, 10);
		return new Date(year, month - 1, day);
	});
	eleventyConfig.addFilter('between', function (date, start, end) {
		return start <= date && date <= end;
	});
	eleventyConfig.addFilter('getBDayStars', function (dateMonth) {
		return characters.filter(ch => ch.attr?.Birth?.substring(5) === dateMonth);
	});
	eleventyConfig.addFilter('getHolidays', function (dateMonth) {
		return holidays[dateMonth]?.days;
	});

	// dateToRFC822 from 11ty rss plugin
	eleventyConfig.addFilter('dateToRfc822', function (value) {
		const date = new Date(value);
		const options = {
			weekday: 'short',
			day: '2-digit',
			month: 'short',
			year: 'numeric',

			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,

			timeZoneName: 'short',
		};

		const formatedDate = new Intl.DateTimeFormat('en-US', options).format(date);
		const [wkd, mmm, dd, yyyy, time, z] = formatedDate.replace(/([,\s+\-]+)/g, ' ').split(' ');
		const tz = `${z}`.replace(/UTC/, 'GMT');

		return `${wkd}, ${dd} ${mmm} ${yyyy} ${time} ${tz}`;
	});
}

function to6DigitHex(hex) {
	if (hex.length < 6)
		hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
	return hex.toUpperCase();
}
function hexToHSL(hex) {
	// hex to rgb first and then rgb to hsl
	// requires 6 digit hex
	let r, g, b;
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	r = parseInt(result[1], 16);
	g = parseInt(result[2], 16);
	b = parseInt(result[3], 16);
	// to hsl next (same code as sort.js)
	r /= 255; g /= 255; b /= 255;
	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let d = max - min;
	let h;
	if (d === 0) h = 0;
	else if (max === r) h = ((g - b) / d + 6) % 6;
	else if (max === g) h = (b - r) / d + 2;
	else if (max === b) h = (r - g) / d + 4;
	let l = (min + max) / 2;
	let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
	return { h: h * 60, s, l };
}
function getHueName(h) {
	if (h < 15) return "red";
	if (h < 45) return "orange";
	if (h < 55) return "yellow";
	if (h < 75) return "lime";
	if (h < 120) return "green";
	if (h < 165) return "blue-green";
	if (h < 200) return "cyan";
	if (h < 250) return "blue";
	if (h < 285) return "purple";
	if (h < 350) return "pink";
	return "red";
}

export default utilPlugin;
