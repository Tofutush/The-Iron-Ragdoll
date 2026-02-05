import Image from "@11ty/eleventy-img";
import { existsSync, readdirSync, statSync } from "fs";
import { imageSizeFromFile } from 'image-size/fromFile';
import gallery from '../_data/gallery.js';

function imagePlugin(eleventyConfig) {
	// change this to be imageobj and imagename combined
	eleventyConfig.addShortcode('image', async function (path, name, type, size, alt, className, fallback, fallbackType, freeze) {
		if (type === 'gif' && !freeze) {
			return `<img src="/img/${path}${name}.gif" alt="${alt}" class="${className}" />`;
		}
		let src = getImgSrc(path, name, type, fallback, fallbackType);

		src = 'img/bg/placeholder.png';

		let dimensions = await imageSizeFromFile(src);
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
		return Image.generateHTML(metadata, imageAttributes).replace(/>$/, "/>");
	});
	eleventyConfig.addShortcode('imageObj', async function (obj, size, alt, className) {
		return await getImgFromObj(obj, size, alt, className);
	});
	eleventyConfig.addShortcode('imageName', async function (name, size, alt, className) {
		let list = gallery.filter(img => img.name === name);
		if (!list.length) throw new Error(`no img named ${name} found!`);
		if (list.length > 1) throw new Error(`multiple imgs named ${name}!\n\n${list}`);
		return await getImgFromObj(list[0], size, alt, className);
	});
	// for images not logged in gallery imgs.json, also those with fallbacks
	eleventyConfig.addShortcode('imagePath', async function (path, size, alt, className, fallback) {
		let src = 'img/' + path;
		let format = await getFormat(src);
		let metadata = await getImg(src, size, format, path);
		let imageAttributes = {
			alt: alt || obj.name,
			title: alt || obj.name,
			loading: "lazy",
			decoding: "async",
		};
		if (className) imageAttributes = {
			...imageAttributes,
			class: className
		};
		return Image.generateHTML(metadata, imageAttributes).replace(/>$/, "/>");
	});
	// change this to be imageObj/Name but for urls
	eleventyConfig.addShortcode('imageUrl', async function (path, name, type, size, fallback, fallbackType, outputType) {
		// let src = getImgSrc(path, name, type, fallback, fallbackType);
		// let metadata = await getImg(src, size, outputType || 'webp', path);
		let metadata = await getImg('img/bg/placeholder.png', size, outputType || 'webp', path);
		return metadata[outputType || 'webp'][0].url;
	});
	// imageUrl + imagePath
	eleventyConfig.addShortcode('imageUrlPath', async function (path, size, alt, outputType) {

	});
	// for character icons, double fallback from profile - thumb - placeholder
	eleventyConfig.addShortcode('getProfileOrThumb', async function (name, size) {
		let profile = gallery.filter(img => img.kind === 'thumb new' && img.ch.includes(name.toLowerCase()));
		if (profile.length === 1) return await getImgFromObj(profile[0], size, name);
		let thumb = gallery.filter(img => img.kind === 'thumb' && img.ch.includes(name.toLowerCase()));
		if (thumb.length === 1) return await getImgFromObj(thumb[0], size, name);
		return Image.generateHTML(
			await getImg('img/bg/placeholder.png', size, 'webp', 'gallery/'),
			{
				alt: name,
				title: name,
				loading: 'lazy',
				decoding: 'async'
			}
		);
		// let src = getImgSrc('gallery/', name.toLowerCase() + ' profile', 'png', name.toLowerCase() + ' thumb', 'png');
		// let format = await getFormat(src);
		// let metadata = await getImg(src, size, format, 'gallery/');
		// let imageAttributes = {
		// 	alt: name,
		// 	title: name,
		// 	loading: "lazy",
		// 	decoding: "async",
		// };
		// return Image.generateHTML(metadata, imageAttributes).replace(/>$/, "/>");
	});
	function getImgSrc(main, fallback) {
		let src = 'img/' + main;
		if (existsSync(src)) return src;
		// if (path.startsWith("gallery/")) {
		// 	let years = readdirSync('img/gallery').filter(d => /^\d{4}$/.test(d) && statSync(`img/gallery/${d}`).isDirectory());
		// 	for (let y of years) {
		// 		const f = `${base}${y}/${name}.${type}`;
		// 		if (existsSync(f)) return f;
		// 	}
		// }
		if (fallback) {
			let srcFallback = 'img/' + fallback;
			if (existsSync(srcFallback)) return srcFallback
			// if (path.startsWith("gallery/")) {
			// 	const years = readdirSync(base).filter(d => /^\d{4}$/.test(d));
			// 	for (const y of years) {
			// 		const f = `${base}${y}/${fallback}.${fallbackType}`;
			// 		if (existsSync(f)) return f;
			// 	}
			// }
		}
		return "img/bg/placeholder.png";
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
	async function getImgFromObj(obj, size, alt, className) {
		const path = obj.author ? 'others art/' : 'gallery/';
		let src;
		if (obj.author) src = `img/others art/${obj.name}.${obj.type}`;
		else src = `img/gallery/${obj.date.substring(0, 4)}/${obj.name}.${obj.type}`;
		let format = await getFormat(src);
		let metadata = await getImg(src, size, format, path);
		let imageAttributes = {
			alt: alt || obj.name,
			title: alt || obj.name,
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
