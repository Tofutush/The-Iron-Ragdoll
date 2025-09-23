import { existsSync } from 'fs';

function funPlugin(eleventyConfig) {
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
	eleventyConfig.addFilter('getStepsData', rels => {
		let graph = {};
		for (let z = 0; z < rels.length; z++) {
			let [a, b] = rels[z].ch;
			let aName = a[0];
			let aRel = a[1] || '';
			let bName = b[0];
			let bRel = b[1] || '';
			if (!graph[aName]) graph[aName] = [];
			if (!graph[bName]) graph[bName] = [];
			graph[aName].push({ name: bName, rel: bRel });
			graph[bName].push({ name: aName, rel: aRel });
		}
		return graph;
	});
}

export default funPlugin;
