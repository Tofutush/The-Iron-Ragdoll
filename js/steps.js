let selects = document.querySelectorAll('.select');
let resultsDiv = document.getElementById('results');
for (let z = 0; z < selects.length; z++) {
    for (let ch of Object.keys(rel).sort((a, b) => a.localeCompare(b))) {
        selects[z].appendChild(elt('option', { value: ch }, ch));
    }
}

function calculate() {
    let ch1 = selects[0].value;
    let ch2 = selects[1].value;
    if (!(ch1 && ch2)) {
        resultsDiv.innerHTML = '';
        resultsDiv.appendChild(elt('p', {}, 'Please select two characters!'));
        return;
    }
    let result = findRelationshipPath(rel, ch1, ch2);
    if (result === 'none') {
        resultsDiv.innerHTML = '';
        resultsDiv.appendChild(elt('p', {}, 'No connection found. Sorry!'));
        return;
    }
    if (result === 'self') {
        resultsDiv.innerHTML = '';
        resultsDiv.appendChild(elt('p', {}, 'These two characters are the same!'));
        return;
    }
}

function findRelationshipPath(graph, start, end) {
    if (start === end) return 'self';

    const visited = new Set();
    const queue = [{ name: start, path: [] }];

    while (queue.length > 0) {
        const { name, path } = queue.shift();

        if (visited.has(name)) continue;
        visited.add(name);

        const neighbors = graph[name] || [];
        for (const neighbor of neighbors) {
            const newPath = [...path, { name, relation: neighbor.relation }];
            if (neighbor.name === end) {
                return [...newPath, { name: end, relation: null }];
            }
            queue.push({ name: neighbor.name, path: newPath });
        }
    }

    return 'none';
}

function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
        if (typeof child != "string") dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;
}