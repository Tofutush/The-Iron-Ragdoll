const vow = { a: 'ㄚ', e: 'ㄜ', i: 'ㄧ', o: 'ㄛ', u: 'ㄨ' }
const con = {
	b: 'ㄅ',
	p: 'ㄆ',
	d: 'ㄉ',
	t: 'ㄊ',
	g: 'ㄍ',
	k: 'ㄎ',
	v: 'ㄏ',
	f: 'ㄈ',
	m: 'ㄇ',
	n: 'ㄋ',
	y: 'ㄦ',
	w: 'ㄩ',
	l: 'ㄌ',
	j: 'ㄐ',
	q: 'ㄑ',
	x: 'ㄒ',
	z: 'ㄗ',
	c: 'ㄘ',
	s: 'ㄙ',
	ž: 'ㄓ',
	č: 'ㄔ',
	š: 'ㄕ',
};
const v = Object.keys(vow);
const c = Object.keys(con);

function langPlugin(eleventyConfig) {
	eleventyConfig.addShortcode('ruby', function (str) {
		let inRuby = false;
		let inRT = false;
		let input = str.replaceAll('zh', 'ž').replaceAll('ch', 'č').replaceAll('sh', 'š');
		let result = '';
		for (let z = 0; z < input.length; z++) {
			let letter = input[z];
			// controls
			if (letter == '[') {
				inRuby = true;
				inRT = false;
				result += '<ruby>';
				continue;
			}
			if (letter == ']') {
				inRuby = false;
				inRT = false;
				result += '</rt></ruby>';
				continue;
			}
			if (letter == '/') {
				if (inRT) {
					inRT = false;
					result += '</rt>'
				} else {
					inRT = true;
					result += '<rt>'
				}
				continue;
			}
			// punctuation
			if (letter == "'") {
				result += '＇';
				continue;
			}
			if (letter == ' ') {
				result += '　';
				continue;
			}
			if (letter == '-') {
				result += '·';
				continue;
			}
			// actual letters
			if (v.includes(letter)) {
				result += vow[letter];
				continue;
			}
			if (c.includes(letter)) {
				result += con[letter];
				continue;
			}
			result += letter;
		}
		return result;
	});
	eleventyConfig.addShortcode('tooltip', function (str) {
		return str.replace(
			/\[([^/]+)\/([^\]]+)\]/g,
			'<span class="tooltip"><span class="tooltip-text">$2</span>$1</span>'
		);
	});
}

export default langPlugin;
