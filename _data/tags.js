const gallery = require('./gallery.json');

module.exports = function() {
	let ch = [];
	for(let z = 0; z < gallery.length; z++) {
		for(let a of gallery[z].ch) {
			ch.push(a);
		}
	}
	return sortByFrequency(ch);
}

// https://stackoverflow.com/questions/3579486/sort-a-javascript-array-by-frequency-and-then-filter-repeats
function sortByFrequency(array) {
	var frequency = {};
	array.forEach(function(value) { frequency[value] = 0; });
	var uniques = array.filter(function(value) {
		return ++frequency[value] == 1;
	});
	return uniques.sort(function(a, b) {
		return frequency[b] - frequency[a];
	});
}