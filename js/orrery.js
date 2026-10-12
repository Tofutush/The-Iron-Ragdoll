let nextTickTime = 0;
let timer = null;

function startOrrery() {
	let now = new Date();
	let nextMin = new Date(now);
	nextMin.setMinutes(now.getMinutes() + 1, 0, 0);
	nextTickTime = nextMin.getTime();
	updateOrrery(now);
	checkTime();
}

function checkTime() {
	let currentTime = Date.now();
	if (currentTime >= nextTickTime) {
		let now = new Date(currentTime);
		updateOrrery(now);
		// 1 min
		nextTickTime += 1 * 60 * 1000;
	}
	// we need to check often bc browsers pause setIntervals/timeouts when tab unfocused
	timer = setTimeout(checkTime, 100);
}

function updateOrrery(dateObj) {
	let minutes = (dateObj.getHours() * 60) + dateObj.getMinutes();

	let dateString = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDay().toString().padStart(2, '0')}`;
	let timeString = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
}

startOrrery();
