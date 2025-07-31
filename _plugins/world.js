function worldPlugin(eleventyConfig) {
	eleventyConfig.addCollection("worldCats", collection => {
		let pages = collection.getFilteredByGlob('tir/world/**/*');
		let tags = [];
		for (let z = 0; z < pages.length; z++) {
			if (!pages[z].data.categories) continue;
			for (let a of pages[z].data.categories) tags.push(a);
		}
		tags = [...new Set(tags)].sort((a, b) => a.localeCompare(b));
		return tags;
	});
}

export default worldPlugin;
