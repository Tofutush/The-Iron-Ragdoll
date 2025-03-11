function storyPlugin(eleventyConfig) {
    eleventyConfig.addCollection("stories", collection =>
        collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => a.data.order - b.data.order)
    );
    eleventyConfig.addFilter('getStoryTags', function (arr) {
        let tags = [];
        for (let z = 0; z < arr.length; z++) {
            if (!arr[z].data.myTags) continue;
            for (let a of arr[z].data.myTags) tags.push(a);
        }
        tags = [...new Set(tags)];
        return tags;
    });
    eleventyConfig.addFilter('filterStoriesByTag', function (arr, tag) {
        return arr.filter(a => a.data.myTags === tag);
    });
}
module.exports = storyPlugin;