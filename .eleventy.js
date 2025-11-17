import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import eleventyRssPlugin from '@11ty/eleventy-plugin-rss';
import pinyin from "chinese-to-pinyin";
import beautify from 'js-beautify';
import markdownIt from 'markdown-it';
import markdownItAnchor from "markdown-it-anchor";
import markdownItExternalLinks from 'markdown-it-external-links';
import markdownItFootnote from "markdown-it-footnote";
import markdownItObsidianCallouts from "markdown-it-obsidian-callouts";
import markdownItTOC from 'markdown-it-table-of-contents';
import chPlugin from './_plugins/ch.js';
import funPlugin from './_plugins/fun.js';
import galleryPlugin from './_plugins/gallery.js';
import imagePlugin from './_plugins/image.js';
import { eleventyLucideIconsPlugin, iconSVGString } from './_plugins/lucideicons.js';
import relPlugin from './_plugins/rel.js';
import storyPlugin from './_plugins/story.js';
import utilPlugin from './_plugins/utils.js';
import worldPlugin from './_plugins/world.js';

export default function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);
	const slug = s => pinyin(s.toString().trim().toLowerCase(), { removeTone: true, keepRest: true }).replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '');
	const mdIt = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItFootnote).use(markdownItAnchor, {
		slugify: slug
	}).use(markdownItTOC, {
		includeLevel: [2, 3, 4],
		transformContainerOpen: () => {
			return '<details id="toc-wrap" open><summary><h3>Contents</h3></summary><div id="toc">';
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
	eleventyConfig.addPlugin(storyPlugin);
	eleventyConfig.addPlugin(worldPlugin);
	eleventyConfig.addPlugin(funPlugin);
	eleventyConfig.addPlugin(eleventyRssPlugin);
	// copies
	eleventyConfig.addPassthroughCopy('img/bg');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('js');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addPassthroughCopy('robots.txt');
	eleventyConfig.addPassthroughCopy('tofutush-public.asc');
	eleventyConfig.addPassthroughCopy('img/gallery/*.gif');
	eleventyConfig.addPassthroughCopy('img/others art/*.gif');
	// filters
	eleventyConfig.addFilter('slug', slug);
	eleventyConfig.addLiquidFilter("dateToRfc822", eleventyRssPlugin.dateToRfc822);
	eleventyConfig.addFilter('getFooterImg', function (arr, name) {
		return arr[Array.from(name).reduce((sum, i) => sum + i.charCodeAt(0), 0) % arr.length];
	});
	eleventyConfig.addFilter('isArray', function (arg) {
		return Array.isArray(arg);
	});
	eleventyConfig.addTransform("htmlmin", async function (content) {
		if ((this.page.outputPath || "").endsWith(".html")) {
			let beautified = beautify.html(content, {
				indent_size: 2,
				preserve_newlines: false
			});
			return beautified;
		}
		// If not an HTML output, return content as-is
		return content;
	});
	// drafts
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});
	return {
		dir: {
			input: 'tir',
			includes: '../_includes',
			layouts: '../_layouts',
			data: '../_data'
		},
		passthroughFileCopy: true
	};
};
