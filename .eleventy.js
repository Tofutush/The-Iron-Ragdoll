const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	// copies
	eleventyConfig.addPassthroughCopy('img');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('Lexend.tff');
	// filters
	eleventyConfig.addFilter('lowerCase', function(s) {
		return s.toLowerCase();
	});
	eleventyConfig.addFilter('getimgurl', function(num) {
		num = parseInt(num);
		return String('/img/comics/' + Math.floor(num / 100) + '/' + num + '.png')
	});
	// shortcodes
	eleventyConfig.addShortcode('arrows', function(f, p, n, l, num) {
		let dot;
		if(this.page.url == '/') dot = '';
		else dot = '..';
		return `
			<div class="options">
				<a ${p ? '' : 'class="noclick"'} href="${dot}${f}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg></a>
				<a ${p ? '' : 'class="noclick"'} href="${dot}${p}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m15 18-6-6 6-6"/></svg></a>
				<p>Page <span class="pagenum" contenteditable="true">${num}</span></p>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${n}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m9 18 6-6-6-6"/></svg></a>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${l}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg></a>
			</div>
		`;
	});
	return {
		passthroughFileCopy: true,
		pathPrefix: '/The-Iron-Ragdoll/'
	};
};