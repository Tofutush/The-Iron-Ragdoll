import Image from "@11ty/eleventy-img";
import { exists, existsSync, readdirSync, statSync } from "fs";
import { imageSizeFromFile } from 'image-size/fromFile';
import gallery from '../_data/gallery.js';

function imagePlugin(eleventyConfig) {
	// img takes any: obj, name, or path (without 'img/')
	// fallback must be path
	eleventyConfig.addShortcode('image', async function (img, size, alt0, className, fallback) {
		let { src, alt } = getImgSrc(img, fallback);
		return await getImgFromObj(src, size, alt0 || alt, className);
	});
	// outputs urls, not html
	eleventyConfig.addShortcode('imageUrl', async function (img, size, outputType = 'webp') {
		let { src } = getImgSrc(img);
		let metadata = await getMetadata(src, size);
		return metadata[outputType || 'webp'][0].url;
	});
	// for character icons, double fallback from profile - thumb - placeholder
	eleventyConfig.addShortcode('getProfileOrThumb', async function (name, size) {
		let profile = gallery.filter(img => img.kind === 'thumb new' && img.ch.includes(name.toLowerCase()));
		if (profile.length === 1) return await getImgFromObj(getImgSrc(profile[0]).src, size, name);
		let thumb = gallery.filter(img => img.kind === 'thumb' && img.ch.includes(name.toLowerCase()));
		if (thumb.length === 1) return await getImgFromObj(getImgSrc(thumb[0]).src, size, name);
		return Image.generateHTML(
			await getImg('img/bg/placeholder.png', size, 'webp', 'gallery/'),
			{
				alt: name,
				title: name,
				loading: 'lazy',
				decoding: 'async'
			}
		);
	});
	// returns string starting from
	function getImgSrc(main, fallback) {
		if (typeof main === 'object') return { src: getSrcFromObj(main), alt: main.name };
		if (typeof main === 'string') {
			let list = gallery.filter(i => i.name === main);
			if (list.length === 1) return { src: getSrcFromObj(list[0]), alt: list[0].name };
			if (list.length > 1) throw new Error(`multiple imgs named ${main} found!`);
			// name not found, try path
			if (existsSync('img/' + main)) return { src: 'img/' + main, alt: '' };
		}
		// main not found, try fallback
		if (fallback) {
			if (typeof fallback === Object) return { src: getSrcFromObj(fallback), alt: fallback.name };
			if (typeof fallback === 'string') {
				let list = gallery.filter(i => i.name === fallback);
				if (list.length === 1) return { src: getSrcFromObj(list[0]), alt: list[0].name };
				if (list.length > 1) throw new Error(`multiple imgs named ${fallback} found!`);
				// name not found, try path
				if (existsSync('img/' + fallback)) return { src: 'img/' + fallback, alt: '' };
			}
		}
		return { src: 'img/bg/placeholder.png', alt: '' };
	}
	// returns string from gallery imgs.json obj
	function getSrcFromObj(obj) {
		if (obj.author) return `img/others art/${obj.name}.${obj.type}`;
		return `img/gallery/${obj.date.substring(0, 4)}/${obj.name}.${obj.type}`;
	}
	async function getFormat(src) {
		let dimensions = await imageSizeFromFile(src);
		return (dimensions.width > 16383 || dimensions.height > 16383) ? 'png' : 'webp';
	}
	async function getImg(src, size, format, path) {
		return await Image(src, {
			widths: [size],
			formats: [format],
			urlPath: '/img/' + path,
			outputDir: './_site/img/' + path
		});
	}
	async function getMetadata(src, size) {
		let format = await getFormat(src);
		return await Image(src, {
			widths: [size],
			formats: [format],
			outputDir: './_site/img/'
		});
	}
	async function getImgFromObj(src, size, alt, className) {
		let metadata = await getMetadata(src, size);
		let imageAttributes = {
			alt: alt,
			title: alt,
			loading: "lazy",
			decoding: "async",
		};
		if (className) imageAttributes = {
			...imageAttributes,
			class: className
		};
		return Image.generateHTML(metadata, imageAttributes).replace(/>$/, "/>");
	}
}

export default imagePlugin;
