module.exports = function(eleventyConfig) {
	// images
	eleventyConfig.addPassthroughCopy('0');
	eleventyConfig.addPassthroughCopy('bg');
	eleventyConfig.addPassthroughCopy('characters');
	eleventyConfig.addPassthroughCopy('log');
	eleventyConfig.addPassthroughCopy('icon.ico');
	// css
	eleventyConfig.addPassthroughCopy('style.css');
	// eleventyConfig.addPassthroughCopy('characters/style.css');
	// js
	eleventyConfig.addPassthroughCopy('authornotes.js');
	eleventyConfig.addPassthroughCopy('comic.js');
	eleventyConfig.addPassthroughCopy('episodes.js');
	eleventyConfig.addPassthroughCopy('page.js');
	// fonts
	eleventyConfig.addPassthroughCopy('stuff');
	return {
		passthroughFileCopy: true
	};
};