import gallery from '../_data/gallery.js';

const withPic = new Set();
for (const img of gallery) {
	if (img.ch?.length === 1 && (img.kind === 'thumb' || img.kind === 'profile')) {
		withPic.add(img.ch[0]);
	}
}

function funPlugin(eleventyConfig) {
	eleventyConfig.addFilter('getGuessData', (chs, rels) => {
		let characters = chs.map(c => c.name).filter(c => hasPic(c));
		let characterSet = new Set(characters);
		let relationships = rels.filter(r =>
			r.ch[0][1] && r.ch[1][1]
			&& characterSet.has(r.ch[0][0])
			&& characterSet.has(r.ch[1][0]));
		relationships = relationships.map(r => r.ch);
		return { ch: characters, rel: relationships }
	});
}

function hasPic(ch) {
	return withPic.has(ch.toLowerCase());
}

export default funPlugin;
