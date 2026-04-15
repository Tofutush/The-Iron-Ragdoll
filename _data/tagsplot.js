import characters from './characters.json' with {type: 'json'};
export default [...new Set([].concat(...characters.map(ch => ch.tags || [])))].sort((a, b) => a.localeCompare(b));
