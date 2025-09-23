import storyOrder from './../_data/stories.json' with {type: 'json'};

function storyPlugin(eleventyConfig) {
	eleventyConfig.addCollection("stories", collection =>
		collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => storyOrder.indexOf(a.fileSlug) - storyOrder.indexOf(b.fileSlug))
	);
	eleventyConfig.addCollection("storyTags", collection => {
		let stories = collection.getFilteredByGlob('tir/stories/*.md');
		let tags = [];
		for (let z = 0; z < stories.length; z++) {
			if (!stories[z].data.myTags) continue;
			for (let a of stories[z].data.myTags) tags.push(a);
		}
		tags = [...new Set(tags)].sort((a, b) => a.localeCompare(b));
		return tags;
	});
	eleventyConfig.addFilter('filterStoriesByTag', function (arr, tag) {
		return arr.filter(a => a.data.myTags?.includes(tag));
	});
	eleventyConfig.addFilter('dialogGetCharacter', function (str) {
		let idx = str.indexOf(': ');
		return str.slice(0, idx);
	});
	eleventyConfig.addFilter('dialogGetLine', function (str) {
		let idx = str.indexOf(': ');
		return str.slice(idx + 2);
	});
	eleventyConfig.addFilter("groupByChapter", function (pages) {
		let chapters = {};
		pages.forEach(page => {
			let chap = page.chapter || 0;
			if (!chapters[chap]) chapters[chap] = [];
			chapters[chap].push(page);
		});
		// Convert to array of {chapter, pages}
		return Object.keys(chapters)
			.sort((a, b) => Number(a) - Number(b))
			.map(chap => ({
				chapter: chap,
				pages: chapters[chap]
			}));
	});
}

export default storyPlugin;
