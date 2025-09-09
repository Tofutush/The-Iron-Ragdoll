import timelineRaw from './timeline-raw.json' with {type: 'json'};

let timeline = timelineRaw.data.items.reduce((prev, curr) => {
	if (!curr.start) return prev;
	let item = [{
		label: curr.type == 'defaultPerson' ? `${curr.label} born` : curr.label,
		time: curr.start.substring(0, 10)
	}];
	if (curr.start != curr.end) {
		item[0].label = curr.type == 'defaultPerson' ? `${curr.label} born` : `Start of ${curr.label}`;
		item.push({
			label: curr.type == 'defaultPerson' ? `${curr.label} died` : `End of ${curr.label}`,
			time: curr.end.substring(0, 10)
		});
	}
	return [...prev, ...item];
}, []);
timeline.sort((a, b) => a.time.localeCompare(b.time));

export default timeline;