import icons from "lucide-static/icon-nodes.json" with {type: 'json'};

function attrsToString(attrs) {
	return Object.keys(attrs).map(key => `${key === 'className' ? 'class' : key}="${attrs[key]}"`).join(' ');
}

function mapSVGContent(icon) {
	return icon.map(elt => `<${elt[0]} ${attrsToString(elt[1])}/>`).join('');
}

function iconSVGString(name, options) {
	const defaultOptions = {
		xmlns: "http://www.w3.org/2000/svg",
		width: 24,
		height: 24,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": 2,
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
	}
	name = name.toLowerCase();
	if (!icons[name]) throw new Error(`icon with name ${name} not found`);
	let attrs = {
		...defaultOptions,
		width: options?.size || options?.width || 24,
		height: options?.size || options?.height || 24,
		className: `lucide lucide-${name}`,
		...options
	};
	delete attrs.size;
	let svgContent = mapSVGContent(icons[name]);
	return `<svg ${attrsToString(attrs)}>${svgContent}</svg>`
}

function eleventyLucideIconsPlugin(eleventyConfig, options = {}) {
	eleventyConfig.addShortcode('lucide', function (name, size, stroke, strokeWidth) {
		let newOptions = { ...options };
		if (size) newOptions.size = size;
		if (stroke) newOptions.stroke = stroke;
		if (strokeWidth) newOptions['stroke-width'] = strokeWidth;
		return iconSVGString(name, newOptions);
	});
}

export {
	iconSVGString,
	eleventyLucideIconsPlugin
}
