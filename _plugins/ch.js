function chPlugin(eleventyConfig) {
    eleventyConfig.addFilter('getChByName', function (arr, name) {
        return arr.find(ch => ch.name == name);
    });
    eleventyConfig.addFilter('getChColor', function (arr, name) {
        let ch = arr.filter(c => c.name.toLowerCase() == name.toLowerCase());
        if (ch.length) return ch[0].color;
        return `Character ${name} not found!`;
    });
    eleventyConfig.addFilter('filterChByTag', function (chs, tag) {
        return chs.filter(c => c.tags?.some(t => t == tag));
    });
    eleventyConfig.addFilter('getFullPalette', function (ch) {
        return Object.assign({ "accent": ch.color }, ch.palette);
    });
}
module.exports = chPlugin;