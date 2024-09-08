const gallery = require('./gallery.js');

module.exports = function() {
	let g = gallery();
	let ch = [];
	for(let z = 0; z < g.length; z++) {
		if(!g[z].ch) continue;
		for(let a of g[z].ch) {
			ch.push(a);
		}
	}
	ch = [...new Set(ch)];
	return ch.sort((a, b) => a.localeCompare(b));
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