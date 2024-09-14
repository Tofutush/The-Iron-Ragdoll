const chs = require('./characters.json');

module.exports = function () {
	let cats = [];
	for (let ch of chs) {
		if (!cats.includes(ch.cat)
			&& ch.cat != 'main'
			&& chs.filter(c => c.cat == ch.cat && c.hidden != true).length > 0) {
			cats.push(ch.cat);
		}
	}
	return cats;
}