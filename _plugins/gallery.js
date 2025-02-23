function galleryPlugin(eleventyConfig) {
    eleventyConfig.addFilter('filterGallery', function (arr, f) {
        return arr.filter(a => a.ch?.includes(f.toLowerCase()));
    });
    eleventyConfig.addFilter('filterGalleryByDate', function (arr, f) {
        return arr.filter(a => a.date?.includes(f));
    });
    eleventyConfig.addFilter('filterGalleryByKind', function (arr, f) {
        return arr.filter(a => a.kind?.includes(f));
    });
    eleventyConfig.addFilter('sortGalleryByChCount', function (arr) {
        return arr.sort((a, b) => a.ch?.length - b.ch?.length);
    });
}
module.exports = galleryPlugin;