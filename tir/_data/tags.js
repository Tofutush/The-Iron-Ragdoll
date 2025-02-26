const gallery = require('./gallery.js');

module.exports = function () {
	let g = gallery();
	let ch = [];
	for (let z = 0; z < g.length; z++) {
		if (!g[z].ch) continue;
		for (let a of g[z].ch) {
			ch.push(a);
		}
	}
	ch = [...new Set(ch)];
	return ch.sort((a, b) => a.localeCompare(b));
}
