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
timeline.sort((a, b) => a.time.localeCompare(b.time));

export default timeline;
