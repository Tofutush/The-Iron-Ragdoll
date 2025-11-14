import C from 'markdown-it-obsidian-callouts';
import gallery from './../_data/gallery imgs.json' with {type: 'json'};

function relPlugin(eleventyConfig) {
	eleventyConfig.addFilter('filterRelations', function (arr, f) {
		return arr.filter(a => a.ch[0][0] == ch || a.ch[1][0] == ch);
	});
	eleventyConfig.addFilter('getMajorRels', function (arr, ch) {
		return arr.filter(a => (a.ch[0][0] == ch || a.ch[1][0] == ch) && a.desc != "");
	});
	eleventyConfig.addFilter('getMinorRels', function (arr, ch) {
		return arr.filter(a => (a.ch[0][0] == ch || a.ch[1][0] == ch) && a.desc == "");
	});
	eleventyConfig.addFilter('getOtherCh', function (rel, ch) {
		return rel.ch.filter(a => a[0] != ch)[0];
	});
	eleventyConfig.addFilter('getRelImg', function (rel) {
		let duos = gallery.filter(img => img.ch?.length === 2 && img.ch.includes(rel.ch[0][0].toLowerCase()) && img.ch.includes(rel.ch[1][0].toLowerCase()));
		let typeIsRel = duos.filter(img => img.kind === 'rel');
		return typeIsRel[0] || duos[0];
	});
}

export default relPlugin;
