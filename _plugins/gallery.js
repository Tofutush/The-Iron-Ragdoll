function galleryPlugin(eleventyConfig) {
	eleventyConfig.addFilter('filterGallery', function (arr, f) {
		return arr.filter(a => a.ch?.includes(f.toLowerCase()));
	});
	eleventyConfig.addFilter('filterGalleryByDate', function (arr, f) {
		return arr.filter(a => a.date?.includes(f));
	});
	eleventyConfig.addFilter('filterGalleryByKind', function (arr, f) {
		return arr.filter(a => a.kind === f);
	});
	eleventyConfig.addFilter('getFirstOfKind', function (arr, f) {
		return arr.filter(a => a.kind === f)[0];
	});
	eleventyConfig.addFilter('getOnlyMyArt', function (arr, f) {
		return arr.filter(a => !a.author);
	});
	eleventyConfig.addFilter('sortGalleryByChCount', function (arr) {
		return arr.sort((a, b) => a.ch?.length - b.ch?.length);
	});
}

export default galleryPlugin;
