const gallery = require('./gallery imgs.json')
module.exports = function () {
	return gallery.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => b.date.localeCompare(a.date));
}