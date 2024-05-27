let episodes = [
	['Intro', 3, 'Just the intro.'],
	['Chapter 1: Welcome to Hillslope', 52, "Sparky settles in her new home. She knows it's supposed to be bad, but somehow it's worse."]
];
let count = 1; // accounts for the cover page
for(let z = 0; z < episodes.length; z++) {
	episodes[z][3] = count;
	count += episodes[z][1];
	episodes[episodes.length - 1].push(count);
}