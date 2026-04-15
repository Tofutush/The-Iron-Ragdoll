import storyOrder from './../_data/stories.json' with {type: 'json'};

function storyPlugin(eleventyConfig) {
	eleventyConfig.addCollection("stories", collection =>
		collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => storyOrder.indexOf(a.fileSlug) - storyOrder.indexOf(b.fileSlug))
	);
	eleventyConfig.addCollection("storyTags", collection => {
		let stories = collection.getFilteredByGlob('tir/stories/*.md');
		return [...new Set([].concat(...stories.map(s => s.data.myTags || [])))].sort((a, b) => a.localeCompare(b));
	});
	eleventyConfig.addFilter('filterStory', function (arr, ch) {
		return arr.filter(s => s.data.chs?.includes(ch.toLowerCase()));
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
	eleventyConfig.addFilter('getNameFromLink', function (link) {
		return link.match(/\[.*\]/)[0].slice(1, -1);
	});
	eleventyConfig.addFilter('getUrlFromLink', function (link) {
		return link.match(/\([^\(\)]*\)(?!.*\([^\(\)]*\))/)[0].slice(1, -1);
	});
	eleventyConfig.addFilter('getNextStories', function (stories, title) {
		return stories.filter(s => s.data.prev?.some(p => p.match(/\[.*\]/)[0].slice(1, -1) == title));
	});

	// fic collections
	addFicCollection('Spy School', 'spy-school');
	addFicCollection('A Nuke From Moreland', 'a-nuke-from-moreland');

	function addFicCollection(parent, url) {
		eleventyConfig.addCollection(`${parent}-fic`, collection =>
			collection.getFilteredByGlob(`tir/stories/${url}/*.md`).sort((a, b) => a.data.chNum - b.data.chNum)
		);
	}
}

export default storyPlugin;
