import characters from '../_data/characters.json' with {type: 'json'};
function chPlugin(eleventyConfig) {
	eleventyConfig.addFilter('getChByName', function (arr, name) {
		return arr.find(ch => ch.name == name || ch.namezh == name) || false;
	});
	eleventyConfig.addFilter('getChColor', function (arr, name) {
		let ch = arr.filter(c => c.name.toLowerCase() == name.toLowerCase());
		if (ch.length) return ch[0].color;
		return `Character ${name} not found!`;
	});
	eleventyConfig.addFilter('filterChByTag', function (chs, tag) {
		return chs.filter(c => c.tags?.some(t => t == tag));
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
