const storyOrder = require('./../_data/stories.json');

function storyPlugin(eleventyConfig) {
    eleventyConfig.addCollection("stories", collection =>
        collection.getFilteredByGlob('tir/stories/*.md').forEach(a => {
            if (a.url.includes('cms')) console.log(a)
        }).sort((a, b) => a.data.order - b.data.order)
    );
    eleventyConfig.addCollection("storyTags", collection => {
        let stories = collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => a.data.order - b.data.order);
        let tags = [];
        for (let z = 0; z < stories.length; z++) {
            if (!stories[z].data.myTags) continue;
            for (let a of stories[z].data.myTags) tags.push(a);
        }
        tags = [...new Set(tags)];
        return tags;
    });
    eleventyConfig.addFilter('filterStoriesByTag', function (arr, tag) {
        return arr.filter(a => a.data.myTags?.includes(tag));
    });
}
module.exports = storyPlugin;