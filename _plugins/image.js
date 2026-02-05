import Image from "@11ty/eleventy-img";
import { existsSync, readdirSync, statSync } from "fs";
import { imageSizeFromFile } from 'image-size/fromFile';
import gallery from '../_data/gallery.js';

function imagePlugin(eleventyConfig) {
	// image in gallery imgs.json, name or obj
	// fallback must be img/path
	eleventyConfig.addShortcode('image', async function (img, size, alt, className, fallback = 'img/bg/placeholder.png') {
		if (typeof img === 'string') {
			let list = gallery.filter(i => i.name === img);
			if (!list.length)
				return Image.generateHTML(
					await getImg(fallback, size, 'webp', 'gallery/'),
					{
						alt: '',
						title: '',
						loading: 'lazy',
						decoding: 'async'
					}
				);
			if (list.length > 1) throw new Error(`multiple imgs named ${img}!\n\n${list}`);
			img = list[0];
		}
		return await getImgFromObj(img, size, alt, className);
	});
	// for images not logged in gallery imgs.json
	eleventyConfig.addShortcode('imagePath', async function (path, size, alt, className, fallback) {
		let src = getImgSrc(path, fallback);
		let format = await getFormat(src);
		let metadata = await getImg(src, size, format, '');
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
	});
	// image, but for urls
	eleventyConfig.addShortcode('imageUrl', async function (img, size, outputType = 'webp', fallback = 'img/bg/placeholder.png') {
		if (typeof img === 'string') {
			let list = gallery.filter(i => i.name === img);
			if (!list.length) {
				return Image.generateHTML(
					await getImg(fallback, size, 'webp', 'gallery/'),
					{
						alt: '',
						title: '',
						loading: 'lazy',
						decoding: 'async'
					}
				);
			}
			if (list.length > 1) throw new Error(`multiple imgs named ${img}!\n\n${list}`);
			img = list[0];
		}
		let metadata = await getMetadataFromObj(img, size);
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
		throw new Error(`img ${main} and fallback ${fallback} both not found`);
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
	async function getMetadataFromObj(obj, size) {
		const path = obj.author ? 'others art/' : 'gallery/';
		let src;
		if (obj.author) src = `img/others art/${obj.name}.${obj.type}`;
		else src = `img/gallery/${obj.date.substring(0, 4)}/${obj.name}.${obj.type}`;
		let format = await getFormat(src);
		return await getImg(src, size, format, path);
	}
	async function getImgFromObj(obj, size, alt, className) {
		let metadata = await getMetadataFromObj(obj, size);
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
