import characters from './characters.json' with {type: 'json'};

export default function () {
	let tags = [];
	for (let z = 0; z < characters.length; z++) {
		if (!characters[z].tags) continue;
		for (let a of characters[z].tags) {
			tags.push(a);
		}
	}
	tags = [...new Set(tags)].sort((a, b) => a.localeCompare(b));
	return tags;
}