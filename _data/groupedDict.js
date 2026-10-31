import dict from './dictionary.json' with {type: 'json'};
const letters = {
	"ئا": "a",
	"ئە": "e",
	"ئې": "ë",
	"ئى": "i",
	"ئو": "o",
	"ئۇ": "u",
	"ب": "b",
	"پ": "p",
	"د": "d",
	"ت": "t",
	"ك": "k",
	"گ": "g",
	"ف": "f",
	"ڤ": "v",
	"ھ": "h",
	"م": "m",
	"ن": "n",
	"ي": "y",
	"ۋ": "w",
	"ل": "l",
	"ز": "z",
	"څ": "c",
	"س": "s",
	"ج": "zh",
	"چ": "ch",
	"ش": "sh",
	"ر": "r",
	"ژ": "j",
	"ق": "q",
	"خ": "x",
	"ث": "th",
	"ذ": "dh"
};
const order = Object.keys(letters);
function getFirst(word) {
	let letter = stripWord(word)[0];
	if ("اەېىوۇ".includes(letter)) letter = 'ئ' + letter;
	return letter;
}
function stripWord(word) {
	return word.replaceAll('-', '').replaceAll('ئ', '');
}
function firstKey(stripped) {
	let letter = stripped[0];
	if ("اەېىوۇ".includes(letter)) letter = 'ئ' + letter;
	return letter;
}
function sortBh(a, b) {
	const aStripped = stripWord(a);
	const bStripped = stripWord(b);
	const aFirst = firstKey(aStripped);
	const bFirst = firstKey(bStripped);
	if (aFirst == a || bFirst == b) return 1;
	const len = Math.min(aStripped.length, bStripped.length);
	for (let i = 0; i < len; i++) {
		const comp = order.indexOf(firstKey(aStripped.slice(i))) - order.indexOf(firstKey(bStripped.slice(i)));
		if (comp != 0) return comp;
	}
	return 1;
}
export default Object.entries(Object.groupBy(dict, word => getFirst(word.bh)))
	.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
	.map(group => [group[0], letters[group[0]], group[1].sort((a, b) => sortBh(a.bh, b.bh))]);
