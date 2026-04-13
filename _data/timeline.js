import timelineRaw from './timeline-raw.json' with {type: 'json'};

let timeline = [];
timelineRaw.data.items.filter(item => item.start).forEach(item => {
	let entry = {
		label: item.type === 'defaultPerson' ? `${item.label} born` : item.label,
		time: item.start.substring(0, 10)
	};
	// if this is an event, find the participants. Event ID should match the subject of the relationship, and the target is the participant
	if (item.type === 'defaultEvent') {
		let participants = [];
		timelineRaw.data.relationships.filter(rel => rel.subject === item.id && rel.relationshipType === 'participantRef').forEach(rel => {
			participants.push(timelineRaw.data.items.filter(ch => ch.type === 'defaultPerson').find(ch => ch.id === rel.target).label);
		});
		if (participants.length) entry.participants = participants;
	} else entry.participants = [item.label]; // otherwise (is person), list said person as a participant
	// has a start and end date
	if (item.start !== item.end) {
		let endEntry = {
			label: item.type === 'defaultPerson' ? `${item.label} died` : `End of ${item.label}`,
			time: item.end.substring(0, 10)
		};
		// if is event, change original entry to Start of event
		if (item.type === 'defaultEvent') entry.label = `Start of ${item.label}`;
		// otherwise (is person), list said person as participant again
		else endEntry.participants = [item.label];
		timeline.push(endEntry);
	}
	timeline.push(entry);
});
/*
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
	if (curr.start != curr.end) {
		item[0].label = curr.type == 'defaultPerson' ? `${curr.label} born` : `Start of ${curr.label}`;
		item.push({
			label: curr.type === 'defaultPerson' ? `${curr.label} died` : `End of ${curr.label}`,
			time: curr.end.substring(0, 10)
		});
	}
	if (curr.type === 'defaultPerson') {
		console.log(item);
		item[0].participants = [curr.label];
		if (item[1]) item[1].participants = [curr.label];
	}
	return [...prev, ...item];
}, []);
*/
timeline.sort((a, b) => a.time.localeCompare(b.time));

export default timeline;
