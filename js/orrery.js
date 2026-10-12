let nextTickTime = 0;
let timer = null;

const dateP = document.getElementById('date');
const timeP = document.getElementById('time');
const starsDiv = document.getElementById('stars');

const colors = {
	sunrise: ["oklch(0.5638 0.1762 16.02)", "oklch(0.7823 0.1318 41.85)"],
	day: ["oklch(0.6647 0.1855 0.53)", "oklch(0.8131 0.1263 88.66)"],
	evening: ["oklch(0.4807 0.151 320.47)", "oklch(0.5786 0.1669 25.64)"],
	twilight: ["oklch(0.1809 0.1092 279.35)", "oklch(0.3457 0.1394 302.85)"],
	night: ["oklch(0 0 0)", "oklch(0.1809 0.1092 279.35)"]
};
const colorTime = [
	{ time: 0, color: colors.night },
	{ time: 3 * 60, color: colors.night },
	{ time: 5 * 60, color: colors.sunrise },
	{ time: 10 * 60, color: colors.day },
	{ time: 14 * 60, color: colors.day },
	{ time: 19 * 60, color: colors.evening },
	{ time: 22 * 60, color: colors.twilight },
	{ time: 24 * 60, color: colors.night }
];

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

	// date & time display
	let dateString = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
	let timeString = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
	dateP.innerHTML = dateString;
	timeP.innerHTML = timeString;
	// bg
	updateBackground(minutes);
	updateStars(minutes);
}
function updateStars(m) {
	let opacity;
	if (m > 7 * 60 && m < 18 * 60) // day
		opacity = 0;
	else if (m < 4 * 60 || m > 22 * 60) // night
		opacity = 1;
	else if (m <= 7 * 60) // dawn
		opacity = 1 - (m - 4 * 60) / (3 * 60);
	else // sunset
		opacity = (m - 18 * 60) / (5 * 60);
	starsDiv.style.opacity = opacity;
}
function updateBackground(m) {
	for (let i = 0; i < colorTime.length - 1; i++) {
		if (m == colorTime[i].time) {
			document.body.style.background = `linear-gradient(${colorTime[i].color[0]}, ${colorTime[i].color[1]})`;
			return;
		}
		if (m > colorTime[i].time && m < colorTime[i + 1].time) {
			a = colorTime[i];
			b = colorTime[i + 1];
			let t = (m - a.time) / (b.time - a.time);
			const topColor = interpolateColor(a.color[0], b.color[0], t);
			const bottomColor = interpolateColor(a.color[1], b.color[1], t);
			document.body.style.background = `linear-gradient(${topColor}, ${bottomColor})`;
		}
	}
}
// parse into [l, c, h]
function parseOKLCH(color) {
	let match = color.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
	if (!match) throw new Error("wrogn oklch: " + color);
	return match.slice(1).map(Number);
}
// interpolate two oklch colors
function interpolateColor(a, b, t) {
	let a2 = parseOKLCH(a);
	let b2 = parseOKLCH(b);
	// go the short hue route
	let hueDiff = b2[2] - a2[2];
	if (hueDiff > 180) hueDiff -= 360;
	if (hueDiff < -180) hueDiff += 360;
	let l = a2[0] + (b2[0] - a2[0]) * t;
	let c = a2[1] + (b2[1] - a2[1]) * t;
	let h = (a2[2] + hueDiff * t + 360) % 360;
	return `oklch(${l} ${c} ${h})`;
}

startOrrery();
