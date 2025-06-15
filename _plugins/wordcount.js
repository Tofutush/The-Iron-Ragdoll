// credits: Rubenwardy https://blog.rubenwardy.com/2023/10/29/eleventy-wordcount/

import { JSDOM } from 'jsdom';

const cache = {};

function countWords(value) {
	if (cache[value]) {
		return cache[value];
	}

	const result = (new JSDOM(value)).window.document.body.textContent
		.split(/[\s;/\\]/)
		.map(x => x.trim())
		// Word is non-empty with at least one letter or number
		.filter(x => x.match(/.*[a-z0-9].*/i))
		.length;

	cache[value] = result;
	return result;
}

function wordCountPlugin(eleventyConfig) {
	eleventyConfig.addFilter('wordCount', countWords);
}

export default wordCountPlugin;
