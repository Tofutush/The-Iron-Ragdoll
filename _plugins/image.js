import Image from "@11ty/eleventy-img";
import { existsSync, readdirSync, statSync } from "fs";
import { imageSizeFromFile } from 'image-size/fromFile';

function imagePlugin(eleventyConfig) {
	eleventyConfig.addShortcode('image', async function (path, name, type, size, alt, className, fallback, fallbackType, freeze) {
		if (type === 'gif' && !freeze) {
			return `<img src="/img/${path}${name}.gif" alt="${alt}" class="${className}" />`;
		}
		let src = getImgSrc(path, name, type, fallback, fallbackType);
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
	eleventyConfig.addShortcode('imageObj', async function (obj, size, alt) {
		const path = obj.author ? 'others art/' : `gallery/${obj.date.substring(0, 4)}/`;
		let src = `img/${path}${obj.name}.${obj.type}`;
		let dimensions = await imageSizeFromFile(src);
		let format = (dimensions.width > 16383 || dimensions.height > 16383) ? 'png' : 'webp';
		let metadata = await getImg(src, size, format, path);
		let imageAttributes = {
			alt: alt || obj.name,
			title: alt || obj.name,
			loading: "lazy",
			decoding: "async",
		};
		return Image.generateHTML(metadata, imageAttributes).replace(/>$/, "/>");
	})
	eleventyConfig.addShortcode('imageUrl', async function (path, name, type, size, fallback, fallbackType, outputType) {
		let src = getImgSrc(path, name, type, fallback, fallbackType);
		let metadata = await getImg(src, size, outputType || 'webp', path);
		return metadata[outputType || 'webp'][0].url;
	});
	function getImgSrc(path, name, type, fallback, fallbackType) {
		const base = `img/${path}`;
		const file = (p, n, t) => `${p}${n}.${t}`;
		if (existsSync(file(base, name, type))) return file(base, name, type);
		if (path.startsWith("gallery/")) {
			const years = readdirSync(base).filter(d => /^\d{4}$/.test(d) && statSync(`${base}${d}`).isDirectory());
			for (const y of years) {
				const f = `${base}${y}/${name}.${type}`;
				if (existsSync(f)) return f;
			}
		}
		if (fallback) {
			if (existsSync(file(base, fallback, fallbackType)))
				return file(base, fallback, fallbackType);
			if (path.startsWith("gallery/")) {
				const years = readdirSync(base).filter(d => /^\d{4}$/.test(d));
				for (const y of years) {
					const f = `${base}${y}/${fallback}.${fallbackType}`;
					if (existsSync(f)) return f;
				}
			}
		}
		return "img/bg/placeholder.png";
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
