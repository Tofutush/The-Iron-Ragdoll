const { EleventyHtmlBasePlugin, EleventyRenderPlugin } = require('@11ty/eleventy');
const Image = require('@11ty/eleventy-img');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require('markdown-it');
const markdownItFootnote = require("markdown-it-footnote");
const markdownItAnchor = require('markdown-it-anchor');
const { minify } = require('html-minifier-terser');

module.exports = function (eleventyConfig) {
	const mdIt = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItFootnote).use(markdownItAnchor);
	mdIt.renderer.rules.footnote_caption = (tokens, idx) => {
		let n = Number(tokens[idx].meta.id + 1).toString();
		if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`;
		return `${n}`;
	}
	mdIt.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
		const n = Number(tokens[idx].meta.id + 1).toString();
		let prefix = '';
		let id = '';
		if (typeof env.docId === 'string') id = `-${env.docId}-`;
		else id = prefix + n;
		if (tokens[idx].meta.subId > 0) id += `:${tokens[idx].meta.subId}`;
		return ` <a href="#fnref${id}" class="footnote-backref"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up"><path d="M8 6L12 2L16 6"/><path d="M12 2V22"/></svg></a>`;
	}
	eleventyConfig.setLibrary("md", mdIt);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(pluginRss);
	const mdRender = new markdownIt();
	// copies
	eleventyConfig.addPassthroughCopy('img/bg');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('js');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('Lexend.ttf');
	// filters
	eleventyConfig.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
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
	eleventyConfig.addFilter('getFullPalette', function (ch) {
		return Object.assign({ "accent": ch.color }, ch.palette);
	});
	eleventyConfig.addFilter('filterRelations', function (arr, f) {
		return arr.filter(a => a.ch[0].includes(f.toLowerCase()) || a.ch[1].includes(f.toLowerCase()));
	});
	eleventyConfig.addFilter('getOtherCh', function (rel, ch) {
		return rel.ch.filter(a => a[0] != ch.toLowerCase())[0];
	});
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
				<a ${p ? '' : 'class="noclick"'} href="${dot}${f}#img"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg></a>
				<a ${p ? '' : 'class="noclick"'} href="${dot}${p}#img"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></a>
				<p><span class="pagenum">${num}</span></p>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${n}#img"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></a>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${l}#img"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg></a>
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
				title: alt,
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
	eleventyConfig.addTransform("htmlmin", async function (content) {
		if ((this.page.outputPath || "").endsWith(".html")) {
			// let minified = htmlmin.minify(content, {
			// 	useShortDoctype: true,
			// 	removeComments: true,
			// 	collapseWhitespace: true,
			// });
			let minified = await minify(content, {
				collapseWhitespace: true,
			});
			return minified;
		}
		// If not an HTML output, return content as-is
		return content;
	});
	return {
		passthroughFileCopy: true,
		// pathPrefix: '/The-Iron-Ragdoll/'
	};
};