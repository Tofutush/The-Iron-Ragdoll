import { existsSync } from 'fs';

function guessPlugin(eleventyConfig) {
	eleventyConfig.addFilter('getGuessData', (chs, rels) => {
		let characters = [], relationships = [];
		characters = chs.filter(c => existsSync(`img/gallery/${c.name.toLowerCase()} thumb.png`)
			|| existsSync(`img/gallery/${c.name.toLowerCase()} profile.png`));
		characters = characters.map(c => c.name);
		relationships = rels.filter(r =>
			r.ch[0][1] && r.ch[1][1]
			&& characters.includes(r.ch[0][0])
			&& characters.includes(r.ch[1][0]));
		relationships = relationships.map(r => r.ch);
		return { ch: characters, rel: relationships }
	});
}

export default guessPlugin;
