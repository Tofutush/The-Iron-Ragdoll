const gallery = require('./gallery imgs.json')
module.exports = function () {
	return gallery.sort((a, b) => a.date.localeCompare(b.date));
}