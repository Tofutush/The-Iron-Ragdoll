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
		let chapters = [];
		let curr = 0;
		for (let page of pages) {
			if (page.chapter) {
				chapters.push([page.chapter, [page]]);
				curr = page.chapter;
				continue;
			}
			chapters[curr][1].push(page);
		}
		console.log(chapters);
		return chapters;
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
