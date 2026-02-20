import Image from "@11ty/eleventy-img";
import { existsSync } from "fs";
import { imageSizeFromFile } from 'image-size/fromFile';
import gallery from '../_data/gallery.js';

function imagePlugin(eleventyConfig) {
	// 1. gallery feed
	// 2. characters/characters
	// 3. same
	// 4. same
	// 5. collections
	// 6. gallery pages
	// 7. same

	// img takes any: obj, name, or path (without 'img/')
	// fallback must be path
	eleventyConfig.addShortcode('image', async function (img, size, alt0, className, fallback, freeze) {
		let { src, alt } = getImgSrc(img, fallback);
		return await getImg(src, size, alt0 || alt, className, freeze);
	});
	// outputs urls, not html
	eleventyConfig.addShortcode('imageUrl', async function (img, size, outputType = 'webp', fallback) {
		let metadata = await getMetadata(getImgSrc(img, fallback).src, size, outputType);
		return metadata[outputType || 'webp'][0].url;
	});
	// for character icons, double fallback from profile - thumb - placeholder
	eleventyConfig.addShortcode('getProfileOrThumb', async function (name, size) {
		return await getImg(getImgSrc(`${name.toLowerCase()} profile`, `${name.toLowerCase()} thumb`).src, size, name);
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
	async function getMetadata(src, size, format, freeze) {
		if (!format) {
			let dimensions = await imageSizeFromFile(src);
			format = (dimensions.width > 16383 || dimensions.height > 16383) ? 'png' : 'webp';
		}
		let options = {
			widths: [size],
			formats: [format],
			outputDir: './_site/img/'
		};
		if (src.includes('holly stand')) {
			console.log(src, size, format);
			console.log(await Image(src, options));
		}
		if (freeze) options.sharpOptions = { animated: true, };
		return await Image(src, options);
	}
	async function getImg(src, size, alt, className, freeze) {
		let metadata = await getMetadata(src, size, 0, freeze);
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
