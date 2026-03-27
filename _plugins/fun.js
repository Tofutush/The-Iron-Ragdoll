import { existsSync, statSync, readdirSync } from 'fs';
import gallery from '../_data/gallery.js';

function funPlugin(eleventyConfig) {
	eleventyConfig.addFilter('getGuessData', (chs, rels) => {
		let characters = [], relationships = [];
		characters = chs.map(c => c.name).filter(c => hasPic(c));
		relationships = rels.filter(r =>
			r.ch[0][1] && r.ch[1][1]
			&& characters.includes(r.ch[0][0])
			&& characters.includes(r.ch[1][0]));
		relationships = relationships.map(r => r.ch);
		return { ch: characters, rel: relationships }
	});
}

function hasPic(ch) {
	let thumb = gallery.filter(i => i.kind === 'thumb' && i.ch.length === 1 && i.ch.includes(ch.toLowerCase()));
	if (thumb.length) return true;
	let profile = gallery.filter(i => i.kind === 'profile' && i.ch.length === 1 && i.ch.includes(ch.toLowerCase()));
	if (profile.length) return true;
	return false;
}

export default funPlugin;
