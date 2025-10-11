import characters from '../_data/characters.json' with {type: 'json'};
import gallery from '../_data/gallery.js';

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
	eleventyConfig.addFilter('getFirst10', function (arr) {
		return arr.slice(0, 10);
	});
	eleventyConfig.addCollection("charactersMoreThan10", collection => {
		return characters.filter(ch =>
			gallery.filter(img =>
				img.ch &&
				img.ch.includes(ch.name.toLowerCase())).length > 10
		);
	});
}

export default galleryPlugin;
