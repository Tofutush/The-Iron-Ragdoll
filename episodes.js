let episodes = [
	[['Intro', 1, 'Just the intro.'],
		[
			['intro', '2023-08-13', 3],
		]
	],
	[['Chapter 1: Welcome to Hillslope', 1, "Sparky settles in her new home. She knows it's supposed to be bad, but somehow it's worse."],
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
			['party', '2023-12-31', 3],
			['lemonade', '2024-01-14', 3],
			['granddad', '2024-01-28', 3],
			['tiles', '2024-02-11', 3],
			['seat', '2024-02-25', 2],
			['useless', '2024-03-10', 4],
			['air', '2024-03-24', 3],
			['well', '2024-04-07', 4],
		]
	],
	[['Chapter 2: Time, Space, and Darts', 1, "Ah, yes, the three fundamental elements of the universe."],
		[
			['time', '2024-05-26', 4],
			['attic', '2024-06-09', 3],
			['fixed', '2024-06-23', 3],
			['mystery', '2024-07-07', 3],
			['cool', '2024-07-21', 2],
			['recap', '2024-08-04', 3],
			['cooperation', '2024-08-18', 3],
			['accident', '09-01-2024', 3],
			['purpose', '09-15-2024', 4],
			['smart', '09-29-2024', 3],
			['surprise', '2024-10-13', 3],
			['party 2', '2024-10-27', 2],
			['cake', '2024-11-10', 2],
		]
	],
	// [['Chapter 3: What Do You Want', 1, "Sparky wakes up tied to a chair. She is now a detective."],
	// 	[
	// 		['1bluh', '9999-99-99', 99],
	// 	]
	// ],
	// [['Chapter 4: Dusty Boxes and Dried Blood', 1, "Detective Sparky is not very good at solving mysteries. But who cares? She doesn't need to be."],
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