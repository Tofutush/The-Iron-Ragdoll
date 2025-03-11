function storyPlugin(eleventyConfig) {
    eleventyConfig.addCollection("stories", collection =>
        collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => a.data.order - b.data.order)
    );
    eleventyConfig.addFilter('getStoryTags', function () {
        let tags = [];
        let arr = collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => a.data.order - b.data.order);
        for (let z = 0; z < arr.length; z++) {
            if (!arr[z].data.myTags) continue;
            for (let a of arr[z].data.myTags) tags.push(a);
        }
        tags = [...new Set(tags)];
        return tags;
    });
}
module.exports = storyPlugin;