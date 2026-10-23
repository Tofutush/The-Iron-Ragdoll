function langPlugin(eleventyConfig) {
	eleventyConfig.addShortcode('tooltip', function (str) {
		return str.replace(
			/\[([^/]+)\/([^\]]+)\]/g,
			'<span class="tooltip"><span class="tooltip-text">$2</span>$1</span>'
		);
	});
}

export default langPlugin;
