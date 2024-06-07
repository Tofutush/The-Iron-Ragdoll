module.exports = function() {
	let episodes = [
		{
			num: 0,
			name: 'Intro',
			desc: 'Just the intro.',
			pages: 2 // it's supposed to be 3, but /page-0/ isnt available, so well just so you know
		},
		{
			num: 1,
			name: 'Welcome to Hillslope',
			desc: "Sparky settles in her new home. She knows it's supposed to be bad, but somehow it's worse.",
			pages: 52
		}
	];
	let count = 1;
	for(let z = 0; z < episodes.length; z++) {
		episodes[z].title = `Chapter ${episodes[z].num}: ${episodes[z].name}`;
		episodes[z].pagenum = count;
		count += episodes[z].pages + 1;
	}
	console.log(episodes);
	return episodes;
}