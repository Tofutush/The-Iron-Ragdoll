import fs from "fs";
import Papa from "papaparse";

const order = [
	"ئا",
	"ئە",
	"ئې",
	"ئى",
	"ئو",
	"ئۇ",
	"ب",
	"پ",
	"د",
	"ت",
	"ك",
	"گ",
	"ف",
	"ڤ",
	"ھ",
	"م",
	"ن",
	"ي",
	"ۋ",
	"ل",
	"ز",
	"څ",
	"س",
	"ج",
	"چ",
	"ش",
	"ر",
	"ژ",
	"ق",
	"خ",
	"ث",
	"ذ"
];
function getFirst(word) {
	let letter = stripWord(word)[0];
	if ("اەېىوۇ".includes(letter)) letter = 'ئ' + letter;
	return letter;
}
function stripWord(word) {
	return word.replaceAll(/[-ـئ]/g, '');
}
function sortBh(a, b) {
	const aStripped = stripWord(a);
	const bStripped = stripWord(b);
	const aFirst = getFirst(aStripped);
	const bFirst = getFirst(bStripped);
	if (aFirst == a) return 1;
	if (bFirst == b) return -1;
	const len = Math.min(aStripped.length, bStripped.length);
	for (let i = 0; i < len; i++) {
		const comp = order.indexOf(getFirst(aStripped.slice(i))) - order.indexOf(getFirst(bStripped.slice(i)));
		if (comp != 0) return comp;
	}
	return 1;
}

let csv = fs.readFileSync('./dictionary.csv', 'utf-8');
let dict = Papa.parse(csv, {
	header: true,
	skipEmptyLines: 'greedy'
}).data;

export default [dict.length, ...Object.entries(Object.groupBy(dict, word => getFirst(word.bh)))
	.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
	.map(group => [group[0], group[1].sort((a, b) => sortBh(a.bh, b.bh))])];
