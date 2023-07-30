let episodes = [
	[['Cover Page', 1],
		[
			['intro', '2023-08-13', 3],
		]
	],
	[['Chapter 1: Welcome to Hillslope', 1],
		[
			['arrival', '2023-08-27', 3],
			['bluff', '2023-09-10', 3],
			['welcome', '2023-09-24', 5],
			['perfume', '2023-10-08', 2],
			['keys', '2023-10-22', 4],
			['twin', '2023-11-05', 2],
			['wake', '2023-11-19', 2],
			['news', '2023-12-03', 3],
			['weirdos', '2023-12-17', 3],
		]
	],
	// [['Chapter 2: What Do You Want', 1],
	// 	[
	// 		['1bluh', '9999-99-99', 99],
	// 	]
	// ],
	// [['Chapter 3: Dusty Boxes and Dried Blood', 1],
	// 	[
	// 		['1bluh', '9999-99-99', 99],
	// 	]
	// ],
	// [['Chapter 4: Where Shit Goes Down', 1],
	// 	[
	// 		['1bluh', '9999-99-99', 99],
	// 	]
	// ],
];
// count page number
let count = 0;
for(let z = 0; z < episodes.length; z++) {
	episodes[z][0][1] = count; // sets the cover page num
	count++; // each chapter takes one cover page
	let eps = episodes[z][1];
	for(let x = 0; x < eps.length; x++) {
		eps[x][3] = count; // sets the episode beginning page num
		count += eps[x][2];
	}
}