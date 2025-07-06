import characters from './characters.json' with {type: 'json'};
import days from './holidays.json' with {type: 'json'};

// tf is this godawful code kid can future you fix it
for (let z = 0; z < characters.length; z++) {
	if (characters[z].attr?.Birthday) {
		let monthDay = characters[z].attr.Birthday.substring(5);
		let obj = {
			image: `${characters[z].name.toLowerCase()} thumb`,
			type: 'png',
			alt: `${characters[z].name}'s birthday`,
			url: `/characters/${characters[z].name.toLowerCase()}/`
		}
		if (days[monthDay]?.days instanceof Array) {
			days[monthDay].days.push(obj);
		}
		else if (days[monthDay] instanceof Object) {
			days[monthDay].days = [obj];
		} else {
			days[monthDay] = { days: [obj] };
		}
	}
}
let year = [
	['January', 31],
	['February', 28],
	['March', 31],
	['April', 30],
	['May', 31],
	['June', 30],
	['July', 31],
	['August', 31],
	['September', 30],
	['October', 31],
	['November', 30],
	['December', 31]
];
let dates = [];
for (let z = 0; z < 12; z++) {
	let month = {
		name: year[z][0],
		days: []
	};
	// actual month
	for (let x = 0; x < year[z][1]; x++) {
		let monthDay = `${(z + 1).toString().padStart(2, '0')}-${(x + 1).toString().padStart(2, '0')}`;
		month.days.push({
			type: 'date',
			date: x + 1,
			bdays: days[monthDay]
		});
	}
	dates.push(month);
}

export default dates;
