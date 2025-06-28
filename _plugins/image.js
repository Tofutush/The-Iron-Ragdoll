import { existsSync } from "fs";
import Image from "@11ty/eleventy-img";
import imageSize from "image-size";

function imagePlugin(eleventyConfig) {
	eleventyConfig.addShortcode('image', async function (path, name, type, size, alt, className, fallback, fallbackType, freeze) {
		if (type === 'gif' && !freeze) {
			return `<img src="/img/${path}${name}.gif" alt="${alt}" class="${className}" />`;
		}
		let src = getImgSrc(path, name, type, fallback, fallbackType);
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
	eleventyConfig.addShortcode('figure', async function (path, name, type, size, alt, caption, className) {
		let src = getImgSrc(path, name, type);
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
		return `<figure ${(className && className !== 'max') ? `class="${className}"` : ''}>${img}<figcaption>${caption ? caption : alt}</figcaption></figure>`;
	});
	eleventyConfig.addShortcode('imageUrl', async function (path, name, type, size, fallback, fallbackType, outputType) {
		let src = getImgSrc(path, name, type, fallback, fallbackType);
		let metadata = await getImg(src, size, outputType || 'webp', path);
		return metadata[outputType || 'webp'][0].url;
	});
	function getImgSrc(path, name, type, fallback, fallbackType) {
		if (existsSync(`img/${path}${name}.${type}`)) return `img/${path}${name}.${type}`;
		if (fallback && existsSync(`img/${path}${fallback}.${fallbackType}`)) return `img/${path}${fallback}.${fallbackType}`;
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
