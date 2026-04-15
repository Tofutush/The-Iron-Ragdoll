function worldPlugin(eleventyConfig) {
	eleventyConfig.addCollection("world", collection =>
		collection.getFilteredByGlob('tir/world/**/*')
	);
	eleventyConfig.addCollection("worldCats", collection => {
		let pages = collection.getFilteredByGlob('tir/world/**/*');
		console.log([...new Set([].concat(...pages.map(p => p.data.categories || [])))].sort((a, b) => a.localeCompare(b)));

		return [...new Set([].concat(...pages.map(p => p.data.categories || [])))].sort((a, b) => a.localeCompare(b));
	});
	eleventyConfig.addFilter('filterWorldByTag', function (arr, tag) {
		return arr.filter(a => a.data.categories?.includes(tag));
	});
}

export default worldPlugin;
