module.exports = function(eleventyConfig) {
	// images
	eleventyConfig.addPassthroughCopy('comics');
	eleventyConfig.addPassthroughCopy('bg');
	eleventyConfig.addPassthroughCopy('characters');
	eleventyConfig.addPassthroughCopy('chapters');
	eleventyConfig.addPassthroughCopy('icon.ico');
	// css
	eleventyConfig.addPassthroughCopy('style.css');
	// eleventyConfig.addPassthroughCopy('characters/style.css');
	// js
	eleventyConfig.addPassthroughCopy('comicpages.js');
	// eleventyConfig.addPassthroughCopy('authornotes.js');
	// eleventyConfig.addPassthroughCopy('comic.js');
	// eleventyConfig.addPassthroughCopy('episodes.js');
	// eleventyConfig.addPassthroughCopy('page.js');
	// fonts
	eleventyConfig.addPassthroughCopy('stuff');
	eleventyConfig.addFilter('getimgurl', function(num) {
		num = parseInt(num);
		return String('/comics/' + Math.floor(num / 100) + '/' + num + '.png')
	});
	eleventyConfig.addShortcode('arrows', function(f, p, n, l, num) {
		return `
<div class="options">
	<a ${p ? '' : 'class="noclick"'} href="${f}"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg></a>
	<a ${p ? '' : 'class="noclick"'} href="${p}"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></a>
	<p>Page <span class="pagenum" contenteditable="true">${num}</span></p>
	<a ${n ? '' : 'class="noclick"'} href="${n}"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></a>
	<a ${n ? '' : 'class="noclick"'} href="${l}"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg></a>
</div>
		`;
	});
	return {
		passthroughFileCopy: true
	};
};