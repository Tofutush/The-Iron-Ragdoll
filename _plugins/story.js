const storyOrder = require('./../_data/stories.json');

function storyPlugin(eleventyConfig) {
    eleventyConfig.addCollection("stories", collection =>
        collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => storyOrder.indexOf(a.fileSlug) - storyOrder.indexOf(b.fileSlug))
    );
    eleventyConfig.addCollection("storyTags", collection => {
        let stories = collection.getFilteredByGlob('tir/stories/*.md').sort((a, b) => a.data.order - b.data.order);
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
}
module.exports = storyPlugin;