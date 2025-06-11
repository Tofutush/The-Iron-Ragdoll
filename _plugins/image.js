import { existsSync } from "fs";
import Image from "@11ty/eleventy-img";
import imageSize from "image-size";

function imagePlugin(eleventyConfig) {
	eleventyConfig.addShortcode('image', async function (path, name, size, alt, className, fallback) {
		let src = getImgSrc(path, name, fallback);
		let dimensions = imageSize(src);
		let format = (dimensions.width > 16383 || dimensions.height > 16383) ? 'png' : 'webp';
		let metadata = await getImg(src, size, format, path);
		let imageAttributes = {
			alt,
			title: alt,
			loading: "lazy",
			decoding: "async",
		};
		if (className) imageAttributes = {
			...imageAttributes,
			class: className
		};
		return Image.generateHTML(metadata, imageAttributes);
	});
	eleventyConfig.addShortcode('figure', async function (path, name, size, alt, caption, className) {
		let src = (existsSync('img/' + path + name)) ? 'img/' + path + name : "img/bg/placeholder.png";
		let metadata = await getImg(src, size, 'webp', path);
		let imageAttributes = {
			alt,
			title: alt,
			loading: "lazy",
			decoding: "async",
		};
		if (className === 'max') imageAttributes = {
			...imageAttributes,
			class: 'max'
		};
		let img = Image.generateHTML(metadata, imageAttributes);
		return `<figure ${(className && className !== 'max') ? `class=${className}` : ''}>${img}<figcaption>${caption ? caption : alt}</figcaption></figure>`;
	});
	eleventyConfig.addShortcode('imageUrl', async function (path, name, size, fallback, type) {
		let src = getImgSrc(path, name, fallback);
		let metadata = await getImg(src, size, type || 'webp', path);
		return metadata[type || 'webp'][0].url;
	});
	function getImgSrc(path, name, fallback) {
		if (existsSync('img/' + path + name)) return 'img/' + path + name;
		if (fallback && existsSync('img/' + path + fallback)) return 'img/' + path + fallback;
		return 'img/bg/placeholder.png';
	}
	async function getImg(src, size, format, path) {
		return await Image(src, {
			widths: [size],
			formats: [format],
			urlPath: '/img/' + path,
			outputDir: './_site/img/' + path
		});
	}
}

export default imagePlugin;
