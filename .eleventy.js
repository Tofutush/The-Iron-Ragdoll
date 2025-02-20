const { EleventyHtmlBasePlugin, EleventyRenderPlugin } = require('@11ty/eleventy');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
// const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require('markdown-it');
const markdownItFootnote = require("markdown-it-footnote");
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTOC = require('markdown-it-table-of-contents');
const markdownItExternalLinks = require('markdown-it-external-links');
const markdownItObsidianCallouts = require('markdown-it-obsidian-callouts');
const { minify } = require('html-minifier-terser');
const pinyin = require('chinese-to-pinyin');
const { iconSVGString, eleventyLucideIconsPlugin } = require('./plugins/lucideicons');
const galleryPlugin = require('./plugins/gallery');
const utilPlugin = require('./plugins/utils');
const chPlugin = require('./plugins/ch');
const relPlugin = require('./plugins/rel');
const imagePlugin = require('./plugins/image');

module.exports = function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);
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
	eleventyConfig.addPlugin(galleryPlugin);
	eleventyConfig.addPlugin(utilPlugin);
	eleventyConfig.addPlugin(chPlugin);
	eleventyConfig.addPlugin(relPlugin);
	eleventyConfig.addPlugin(imagePlugin);
	// copies
	eleventyConfig.addPassthroughCopy('img/bg');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('js');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addPassthroughCopy('robots.txt');
	eleventyConfig.addPassthroughCopy('img/gallery/*.gif');
	eleventyConfig.addPassthroughCopy('_data/graphData.js');
	// collections
	eleventyConfig.addCollection("stories", collection =>
		collection.getFilteredByGlob('stories/*.md').sort((a, b) => a.data.order - b.data.order)
	);
	// filters
	eleventyConfig.addFilter('slug', slug);
	eleventyConfig.addFilter('filterStory', function (arr, ch) {
		return arr.filter(s => s.data.chs.includes(ch.toLowerCase()));
	});
	eleventyConfig.addFilter('getimgurl', function (num) {
		num = parseInt(num);
		return String(Math.floor(num / 100) + '/' + num)
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
				<a ${p ? '' : 'class="noclick"'} href="/${dot}${f}#img">${iconSVGString('chevrons-left')}</a>
				<a ${p ? '' : 'class="noclick"'} href="/${dot}${p}#img">${iconSVGString('chevron-left')}</a>
				<p><span class="pagenum">${num}</span></p>
				<a ${n ? '' : 'class="noclick"'} href="/${dot}${n}#img">${iconSVGString('chevron-right')}</a>
				<a ${n ? '' : 'class="noclick"'} href="/${dot}${l}#img">${iconSVGString('chevrons-right')}</a>
			</div>
		`;
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