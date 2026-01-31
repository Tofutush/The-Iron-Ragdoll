import characters from './characters.json' with { type: 'json' };
import gallery from './gallery.js';
export default characters.filter(ch => gallery.filter(img => img.ch && img.ch.includes(ch.name.toLowerCase())).length > 10);