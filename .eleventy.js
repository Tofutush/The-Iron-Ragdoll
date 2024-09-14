const { EleventyHtmlBasePlugin, EleventyRenderPlugin } = require('@11ty/eleventy');
const Image = require('@11ty/eleventy-img');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const MarkdownIt = require('markdown-it');

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	const mdRender = new MarkdownIt();
	// copies
	eleventyConfig.addPassthroughCopy('img/bg');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('js');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('Lexend.ttf');
	// filters
	eleventyConfig.addFilter('lowerCase', function (s) {
		return s.toLowerCase();
	});
	eleventyConfig.addFilter('upperCase', function (s) {
		return s.toUpperCase();
	});
	eleventyConfig.addFilter('capitalize', function (s) {
		return s[0].toUpperCase() + s.slice(1);
	});
	eleventyConfig.addFilter('getimgurl', function (num) {
		num = parseInt(num);
		return String(Math.floor(num / 100) + '/' + num)
	});
	eleventyConfig.addFilter('getChByName', function (arr, name) {
		return arr.find(ch => ch.name == name);
	});
	eleventyConfig.addFilter('filterGallery', function (arr, f) {
		return arr.filter(a => {
			if (a.ch) return a.ch.includes(f.toLowerCase())
		});
	});
	eleventyConfig.addFilter('getChByCat', function (arr, cat) {
		return arr.filter(c => c.cat == cat);
	});
	eleventyConfig.addFilter('getChColor', function (arr, name) {
		let ch = arr.filter(c => c.name.toLowerCase() == name.toLowerCase());
		if (ch.length) return ch[0].color;
		return `Character ${name} not found!`;
	});
	eleventyConfig.addFilter('filterRelations', function (arr, f) {
		return arr.filter(a => a.ch.includes(f.toLowerCase()));
	});
	eleventyConfig.addFilter('getOtherCh', function (rel, ch) {
		return rel.ch.filter(a => a != ch.toLowerCase()).join();
	})
	eleventyConfig.addFilter('renderMD', function (rawString) {
		return mdRender.render(rawString);
	});
	eleventyConfig.addFilter('slice', function (str, s, e) {
		return str.slice(s, e ? e : str.length);
	});
	// shortcodes
	eleventyConfig.addShortcode('arrows', function (f, p, n, l, num) {
		let dot;
		if (this.page.url == '/') dot = '';
		else dot = '..';
		return `
			<div class="options">
				<a ${p ? '' : 'class="noclick"'} href="${dot}${f}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg></a>
				<a ${p ? '' : 'class="noclick"'} href="${dot}${p}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m15 18-6-6 6-6"/></svg></a>
				<p><span class="pagenum" contenteditable="true">${num}</span></p>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${n}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m9 18 6-6-6-6"/></svg></a>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${l}#comic"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg></a>
			</div>
		`;
	});
	eleventyConfig.addShortcode('image', async function (path, name, size, alt) {
		try {
			let metadata = await Image('img/' + path + name, {
				widths: [size],
				formats: ['webp'],
				urlPath: '/img/' + path,
				outputDir: './_site/img/' + path
			});
			let imageAttributes = {
				alt,
				loading: "lazy",
				decoding: "async",
			};
			return Image.generateHTML(metadata, imageAttributes);
		} catch (e) {
			return '<p>TBA!</p>';
		}
	});
	eleventyConfig.addShortcode('imageOrig', async function (path, name, alt) {
		try {
			let metadata = await Image('img/' + path + name, {
				widths: ['auto'],
				formats: ['auto'],
				urlPath: '/img/' + path,
				outputDir: './_site/img/' + path
			});
			let imageAttributes = {
				alt,
				loading: "lazy",
				decoding: "async",
			};
			return Image.generateHTML(metadata, imageAttributes);
		} catch (e) {
			return '<p>TBA!</p>';
		}
	});
	return {
		passthroughFileCopy: true,
		// pathPrefix: '/The-Iron-Ragdoll/'
	};
};