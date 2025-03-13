const gallery = require('./gallery imgs.json')
module.exports = function () {
	return gallery.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => {
		if (!a.author && b.author) return -1;
		if (a.author && !b.author) return 1;
		return 0;
	});
}