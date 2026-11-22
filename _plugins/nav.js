import { DepGraph } from 'dependency-graph';

// Equivalent to @11ty/eleventy-navigation's breadcrumb filter, but the
// navigation dependency graph is built once per build instead of on every
// call (it is otherwise rebuilt for each page that renders breadcrumbs).
function navPlugin(eleventyConfig) {
	let cachedNodes = null;
	let cachedGraph = null;
	eleventyConfig.on('eleventy.before', () => {
		cachedNodes = null;
		cachedGraph = null;
	});

	function getDependencyGraph(nodes) {
		if (nodes !== cachedNodes) {
			cachedNodes = nodes;
			cachedGraph = buildDependencyGraph(nodes);
		}
		return cachedGraph;
	}

	eleventyConfig.addFilter('navBreadcrumb', function (nodes, activeKey, options = {}) {
		let graph = getDependencyGraph(nodes);
		if (isOptionMatch(options, 'allowMissing') && !graph.hasNode(activeKey)) {
			return [];
		}
		let deps = graph.dependenciesOf(activeKey);
		if (isOptionMatch(options, 'includeSelf')) deps.push(activeKey);
		return activeKey ? deps.map(key => {
			let data = Object.assign({}, graph.getNodeData(key));
			delete data.children;
			data._isBreadcrumb = true;
			return data;
		}) : [];
	});
}

function findNavigationEntries(nodes = [], key = '') {
	let keys = key.split(',').filter(k => Boolean(k));
	let pages = {};
	for (let entry of nodes) {
		let data = entry?.data || {};
		if (data?.eleventyNavigation) {
			let { eleventyNavigation } = data;

			let pageKey;
			if (!key && !eleventyNavigation.parent) { // top level (no parents)
				pageKey = '__default';
			} else if (keys.includes(eleventyNavigation.parent)) {
				pageKey = eleventyNavigation.parent;
			}

			if (pageKey) {
				if (!pages[pageKey]) pages[pageKey] = [];
				let url = eleventyNavigation.url ?? data?.page?.url;

				pages[pageKey].push(Object.assign({ data }, eleventyNavigation, {
					...(url ? { url } : {}),
					pluginType: 'eleventy-navigation',
					...(keys.length > 0 ? { parentKey: eleventyNavigation.parent } : {}),
				}));
			}
		}
	}

	return Object.values(pages).flat().sort(function (a, b) {
		if (a.pinned && b.pinned) {
			return (a.order || 0) - (b.order || 0);
		}

		let order = [a.order, b.order];
		if (a.pinned) order[0] = -Infinity;
		if (b.pinned) order[1] = -Infinity;

		if (order[0] === undefined && order[1] === undefined) return 0;
		if (order[1] === undefined) return -1;
		if (order[0] === undefined) return 1;
		return order[0] - order[1];
	}).map(function (entry) {
		if (!entry.title) entry.title = entry.key;
		if (entry.key) entry.children = findNavigationEntries(nodes, entry.key);
		return entry;
	});
}

function addDependencies(pages, depGraph, parentKey) {
	for (let page of pages) {
		depGraph.addNode(page.key, page);
		if (parentKey) depGraph.addDependency(page.key, parentKey);
		if (page.children) addDependencies(page.children, depGraph, page.key);
	}
}

function buildDependencyGraph(nodes) {
	let graph = new DepGraph();
	addDependencies(findNavigationEntries(nodes), graph);
	return graph;
}

// Liquid.js issue #35
function isOptionMatch(options, name) {
	if (Array.isArray(options)) return options[options.indexOf(name)];
	return options[name];
}

export default navPlugin;
