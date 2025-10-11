import gallery from './gallery imgs.json' with {type: 'json'};

export default gallery.sort((a, b) => b.date.localeCompare(a.date));
