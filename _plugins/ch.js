function chPlugin(eleventyConfig) {
	eleventyConfig.addFilter('getChByName', function (arr, name) {
		return arr.find(ch => ch.name == name) || false;
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
		return arr.filter(ch => ch.attr?.Birthday).sort((a, b) => a.attr.Birthday.localeCompare(b.attr.Birthday));
	});
}

export default chPlugin;
