const vowels = ['a', 'e', 'i', 'o', 'u'];
const yesEnd = [
	"b",
	"p",
	"d",
	"t",
	"g",
	"k",
	"v",
	"f",
	"m",
	"n",
	"j",
	"q",
	"x",
	"z",
	"c",
	"s",
	"ž",
	"č",
	"š",
]
const noEnd = ['y', 'w', 'l'];

function attrsToString(attrs) {
	return Object.keys(attrs).map(key => `${key === 'className' ? 'class' : key}="${attrs[key]}"`).join(' ');
}

function langPlugin(eleventyConfig) {
	eleventyConfig.addShortcode('bauhinian', function (str, size, ruby = true, stroke, strokeWidth) {
		let syllables = strToSyllables(str);
		let final = '';
		if (ruby) final = "<ruby>";
		for (let syl of syllables) {
			final += syllableToSVG(syl, size, stroke, strokeWidth);
			if (ruby) final += `<rt>${syl.replaceAll('ž', 'zh').replaceAll('č', 'ch').replaceAll('š', 'sh')}</rt>`
		}
		if (ruby) final += '</ruby>';
		return final;
	});
	function strToSyllables(str) {
		let vowels = ['a', 'e', 'i', 'o', 'u'];
		str = str.toLowerCase().replaceAll('zh', 'ž').replaceAll('ch', 'č').replaceAll('sh', 'š');
		let result = [];
		let current = '';
		let hasVowel = false;
		for (let z = 0; z < str.length; z++) {
			let letter = str[z];
			// if punctuation, add syllable first
			if (['·', '-', ' ', "'"].includes(letter)) {
				if (current) result.push(current);
				current = '';
				hasVowel = false;
				if (letter === '·') result.push('·');
				if (letter === ' ' && result[result.length - 1] !== ' ') result.push(' ');
				continue;
			}
			// add vowel
			if (vowels.includes(letter)) {
				current += letter;
				hasVowel = true;
				continue;
			}
			// rest are all consonants
			if (current === '') {
				// empty syllable rn, just add the letter
				current += letter;
				continue;
			}
			if (hasVowel) {
				// has vowel already, need to see if this letter belongs here or next syllable
				if (vowels.includes(str[z + 1])) {
					// next is vowel, doesnt belong
					result.push(current);
					// add letter to current, since next iterations is next letter
					current = letter;
				} else {
					// next isnt vowel, so consonant or apostrophe. does belong
					current += letter;
					result.push(current);
					current = '';
				}
				hasVowel = false;
				continue;
			}
		}
		if (current) result.push(current);
		return result;
	}
	function syllableToSVG(syl, size, stroke, strokeWidth) {
		// check if syllable valid (one consonant is also valid)
		let vow = vowels.join('');
		let con1 = yesEnd.join('');
		let con2 = noEnd.join('');
		console.assert(syl.length <= 3 && syl.length > 0);
		console.assert(new RegExp(`^(?:[${vow}]|[${con1}${con2}]|[${vow}][${con1}]|[${con1}${con2}][${vow}]|[${con1}${con2}][${vow}][${con1}])$`).test(syl));
		// copied from the lucide one
		const defaultOptions = {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24", // this might need to change
			fill: "none",
			stroke: "currentColor",
			"stroke-width": 2,
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
		};
		let attrs = {
			...defaultOptions,
			width: size || '1.5em',
			height: size || '1.5em',
			stroke: stroke || 'currentColor',
			"stroke-width": strokeWidth || 2,
			className: `bauhinian bauhinian-${syl}`
		};
		let split = syl.split();
		if (split.length === 1) {
			if (vowels.includes(split[0])) {
				// return single vowel
			} else {
				// return two parts of consonant (and 1 if y/w/l)
			}
		}
		if (split.length === 3) {
		}
		if (split.length === 2) {
			if (vowels.includes(split[0])) {
			}
			if (vowels.includes(split[1])) {
			}
		}
		return `<svg ${attrsToString(attrs)}><rect width="24" height="24" fill="black"/></svg>`;
	}
}

export default langPlugin;
