function relPlugin(eleventyConfig) {
	eleventyConfig.addFilter('filterRelations', function (arr, f) {
		return arr.filter(a => a.ch[0].includes(f) || a.ch[1].includes(f));
	});
	eleventyConfig.addFilter('getOtherCh', function (rel, ch) {
		return rel.ch.filter(a => a[0] != ch)[0];
	});
}

export default relPlugin;
