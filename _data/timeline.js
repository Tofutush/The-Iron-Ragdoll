import timelineRaw from './timeline-raw.json' with {type: 'json'};

let timeline = timelineRaw.data.items.reduce((prev, curr) => {
	if (!curr.start) return prev;
	let item = [{
		label: curr.type === 'defaultPerson' ? `${curr.label} born` : curr.label,
		time: curr.start.substring(0, 10)
	}];
	// if this is an event, find the participants. Event ID should match the subject of the relationship, and the target is the participant
	if (curr.type === 'defaultEvent') {
		let participants = [];
		timelineRaw.data.relationships.filter(rel => rel.subject === curr.id && rel.relationshipType === 'participantRef').forEach(rel => {
			participants.push(timelineRaw.data.items.find(item => item.id === rel.target).label);
		});
		if (participants.length) item[0].participants = participants;
	}
	if (curr.end && curr.start != curr.end) {
		item[0].label = curr.type == 'defaultPerson' ? `${curr.label} born` : `Start of ${curr.label}`;
		item.push({
			label: curr.type === 'defaultPerson' ? `${curr.label} died` : `End of ${curr.label}`,
			time: curr.end.substring(0, 10)
		});
	}
	return [...prev, ...item];
}, []);
timeline.sort((a, b) => a.time.localeCompare(b.time));

export default timeline;
