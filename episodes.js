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
// // count page number
// let count = 0;
// for(let z = 0; z < episodes.length; z++) {
// 	episodes[z][0][1] = count; // sets the cover page num
// 	count++; // each chapter takes one cover page
// 	let eps = episodes[z][1];
// 	for(let x = 0; x < eps.length; x++) {
// 		eps[x][3] = count; // sets the episode beginning page num
// 		count += eps[x][2];
// 	}
// }