import characters from '../_data/characters.json' with {type: 'json'};

const byName = new Map();
const byLowerName = new Map();
for (const ch of characters) {
	if (!byName.has(ch.name)) byName.set(ch.name, ch);
	if (ch.namezh !== undefined && !byName.has(ch.namezh)) byName.set(ch.namezh, ch);
	const lowerName = ch.name.toLowerCase();
	if (!byLowerName.has(lowerName)) byLowerName.set(lowerName, ch);
}

function chPlugin(eleventyConfig) {
	eleventyConfig.addFilter('getChByName', function (name) {
		return byName.get(name) || false;
	});
	eleventyConfig.addFilter('getChColor', function (name) {
		let ch = byLowerName.get(name.toLowerCase());
		if (ch) return ch.color;
		return `Character ${name} not found!`;
	});
	eleventyConfig.addFilter('filterChByTag', function (tag) {
		return characters.filter(c => c.tags?.some(t => t == tag));
	});
	eleventyConfig.addFilter('getFullPalette', function (ch) {
		return Object.assign({ "soul": ch.color }, ch.palette);
	});
	eleventyConfig.addFilter('sortByAge', function (arr) {
		return arr.filter(ch => ch.attr?.Birth).sort((a, b) => a.attr.Birth.localeCompare(b.attr.Birth));
	});
	eleventyConfig.addShortcode('zhLink', function (name) {
		let index = Math.floor(characters.findIndex(ch => ch.namezh == name) / 50) + 1;
		return `/中文/角色/${index == 1 ? '' : index + '/'}#${name}`;
	});
}

export default chPlugin;
