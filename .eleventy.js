const { EleventyHtmlBasePlugin, EleventyRenderPlugin } = require('@11ty/eleventy');
const Image = require('@11ty/eleventy-img');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
// const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require('markdown-it');
const markdownItFootnote = require("markdown-it-footnote");
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTOC = require('markdown-it-table-of-contents');
const markdownItExternalLinks = require('markdown-it-external-links');
const markdownItObsidianCallouts = require('markdown-it-obsidian-callouts');
const { minify } = require('html-minifier-terser');
const { existsSync } = require("fs");
const pinyin = require('chinese-to-pinyin');
const { iconSVGString, eleventyLucideIconsPlugin } = require('./lucideicons.js');
const imageSize = require('image-size');

module.exports = function (eleventyConfig) {
	let footerIndex = 0;

	const slug = s => pinyin(s.toString().trim().toLowerCase(), { removeTone: true, keepRest: true }).replace(/\s+/g, '-').replace(/-+/g, '-').replace(/\'+/g, '');
	const mdIt = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItFootnote).use(markdownItAnchor, {
		slugify: slug
	}).use(markdownItTOC, {
		includeLevel: [2, 3, 4],
		transformContainerOpen: () => {
			return '<details id="toc-wrap"><summary><h3>Table of Contents</h3></summary><div id="toc">';
		},
		transformContainerClose: () => {
			return '</div></details>';
		},
	}).use(markdownItExternalLinks, {
		externalTarget: '_blank'
	}).use(markdownItObsidianCallouts);
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
		return ` <a href="#fnref${id}" class="footnote-backref">${iconSVGString('move-up', { size: 18 })}</a>`;
	}
	eleventyConfig.setLibrary("md", mdIt);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
	eleventyConfig.addPlugin(eleventyLucideIconsPlugin);
	const mdRender = new markdownIt();
	// copies
	eleventyConfig.addPassthroughCopy('img/bg');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('js');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addPassthroughCopy('robots.txt');
	// collections
	eleventyConfig.addCollection("stories", collection =>
		collection.getFilteredByGlob('stories/*.md').sort((a, b) => a.data.order - b.data.order)
	);
	// filters
	eleventyConfig.addFilter('slug', slug);
	eleventyConfig.addFilter('randomItem', function (arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	});
	eleventyConfig.addFilter('filterStory', function (arr, ch) {
		return arr.filter(s => s.data.chs.includes(ch.toLowerCase()));
	});
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
	eleventyConfig.addFilter('padStart', function (n, num, token) {
		return n.toString().padStart(num, token);
	});
	eleventyConfig.addFilter('filterGallery', function (arr, f) {
		return arr.filter(a => a.ch?.includes(f.toLowerCase()));
	});
	eleventyConfig.addFilter('filterGalleryByDate', function (arr, f) {
		return arr.filter(a => a.date?.includes(f));
	});
	eleventyConfig.addFilter('filterGalleryByKind', function (arr, f) {
		return arr.filter(a => a.kind?.includes(f));
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
	eleventyConfig.addFilter('to6DigitHex', function (hex) {
		if (hex.length < 6) {
			if (hex[0] == '#') hex = hex.substring(1);
			hex = '#' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		return hex;
	})
	eleventyConfig.addFilter('calculateBlackWhite', function (color) {
		color = color.substring(1);
		let rgbArr = [
			parseInt(color.substring(0, 2), 16),
			parseInt(color.substring(2, 4), 16),
			parseInt(color.substring(4, 6), 16),
		];
		return Math.round(rgbArr[0] * 299 + rgbArr[1] * 587 + rgbArr[2] * 114) / 1000 > 125 ? '#121212' : '#fff9f2';
	});
	eleventyConfig.addFilter('filterRelations', function (arr, f) {
		return arr.filter(a => a.ch[0].includes(f) || a.ch[1].includes(f));
	});
	eleventyConfig.addFilter('getOtherCh', function (rel, ch) {
		return rel.ch.filter(a => a[0] != ch)[0];
	});
	eleventyConfig.addFilter('renderMD', function (rawString) {
		return mdRender.render(rawString);
	});
	eleventyConfig.addFilter('slice', function (str, s, e) {
		return str.slice(s, e ? e : str.length);
	});
	eleventyConfig.addFilter('filterChByTag', function (chs, tag) {
		return chs.filter(c => c.tags?.some(t => t == tag));
	});
	eleventyConfig.addFilter('getFooterImg', function (arr) {
		return arr[footerIndex++ % arr.length];
	})
	// shortcodes
	eleventyConfig.addShortcode('arrows', function (f, p, n, l, num) {
		let dot;
		if (this.page.url == '/') dot = '';
		else dot = '..';
		return `
			<div class="options">
				<a ${p ? '' : 'class="noclick"'} href="${dot}${f}#img">${iconSVGString('chevrons-left')}</a>
				<a ${p ? '' : 'class="noclick"'} href="${dot}${p}#img">${iconSVGString('chevron-left')}</a>
				<p><span class="pagenum">${num}</span></p>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${n}#img">${iconSVGString('chevron-right')}</a>
				<a ${n ? '' : 'class="noclick"'} href="${dot}${l}#img">${iconSVGString('chevrons-right')}</a>
			</div>
		`;
	});
	eleventyConfig.addShortcode('image', async function (path, name, size, alt, className, fallback) {
		let src = (existsSync('img/' + path + name)) ? 'img/' + path + name : (existsSync('img/' + path + fallback) ? 'img/' + path + fallback : "img/bg/placeholder.png");
		let dimensions = imageSize(src);
		let format = (dimensions.width > 16383 || dimensions.height > 16383) ? 'png' : 'webp';
		let metadata = await Image(src, {
			widths: [size],
			formats: [format],
			urlPath: '/img/' + path,
			outputDir: './_site/img/' + path
		});
		let imageAttributes = {
			alt,
			title: alt,
			class: className,
			loading: "lazy",
			decoding: "async",
		};
		return Image.generateHTML(metadata, imageAttributes);
	});
	eleventyConfig.addShortcode('figure', async function (path, name, size, alt, caption, className) {
		let src = (existsSync('img/' + path + name)) ? 'img/' + path + name : "img/bg/placeholder.png";
		let metadata = await Image(src, {
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
		let img = Image.generateHTML(metadata, imageAttributes);
		return `<figure class="${className}">${img}<figcaption>${caption ? caption : alt}</figcaption></figure>`;
	});
	eleventyConfig.addTransform("htmlmin", async function (content) {
		if ((this.page.outputPath || "").endsWith(".html")) {
			let minified = await minify(content, {
				collapseWhitespace: true,
				minifyCSS: true,
				minifyJS: true
			});
			return minified;
		}
		// If not an HTML output, return content as-is
		return content;
	});
	return {
		passthroughFileCopy: true,
	};
};