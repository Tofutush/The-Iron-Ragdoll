class Quiz {
	constructor(div, quizContent) {
		this.div = div;
		this.desc = quizContent.desc;
		this.questions = quizContent.questions;
		this.results = quizContent.results;
		this.randomize = quizContent.randomize;
		this.quizID = quizContent.id;

		this.responses = [];
		this.bigQDiv = elt('div', { id: 'questions' });
		this.resultsDiv = elt('div', { id: 'results' });
		this.buttonDiv = elt('button', { style: 'display: block; margin: auto', onclick: () => this.submit() }, 'Submit!');
	}

	init() {
		this.div.innerHTML = '';
		this.div.appendChild(this.resultsDiv);
		if (localStorage.getItem(this.quizID + 'QuizResult')) {
			this.renderResult(JSON.parse(localStorage.getItem(this.quizID + 'QuizResult')));
		}
		let descP = elt('p', {});
		descP.innerHTML = this.desc;
		this.div.appendChild(descP);
		this.div.appendChild(elt('p', { className: 'graybox' }, 'Select an answer for the options below. You can also leave questions empty. Some questions may be multi-select, and will be marked as such.'));
		// questions
		for (let z = 0; z < this.questions.length; z++) {
			this.bigQDiv.appendChild(elt('hr'));
			let q = this.questions[z];
			// set the question's response to its empty response object, if there is one
			this.responses[z] = q.response;
			let questionDiv = elt('div', { className: 'question' });
			questionDiv.appendChild(elt('ol', { start: z + 1 }, elt('li', {}, elt('strong', {}, q.title + (q.multi ? ' (Choose multiple)' : '')))));
			let ulDiv = elt('ul');
			if (q.randomize ?? this.randomize) shuffle(q.answers);
			for (let x = 0; x < q.answers.length; x++) {
				let a = q.answers[x];
				let inputDiv;
				if (q.multi) inputDiv = elt('input', { name: 'q' + z, type: 'checkbox', onchange: e => this.setMultiAnswer(e, z, a.response, ulDiv) });
				else inputDiv = elt('input', { name: 'q' + z, type: 'radio', onchange: e => this.setAnswer(z, a.response) });
				let labelDiv = elt('label', {}, inputDiv, a.text);
				let liDiv = elt('li', {}, labelDiv);
				ulDiv.appendChild(liDiv);
			}
			// add none of the above
			if (q.multi && q.addNoneAbove) {
				let liDiv = elt('li', { className: 'none-of-the-above' }, elt('label', {}, elt('input', { name: 'q' + z, type: 'checkbox', onchange: e => this.noneOfTheAbove(z, q.response, ulDiv) }), 'None of the above.'));
				ulDiv.appendChild(liDiv);
			}
			questionDiv.appendChild(ulDiv);
			this.bigQDiv.appendChild(questionDiv);
		}
		this.div.appendChild(this.bigQDiv);
		// submit
		this.div.appendChild(elt('hr'));
		this.div.appendChild(this.buttonDiv);
	}

	setAnswer(qIdx, personalities) {
		this.responses[qIdx] = personalities;
		console.log(this.responses);
	}

	setMultiAnswer(e, qIdx, personalities, ulDiv) {
		// remove none of the above and empty out the results
		if (ulDiv.lastChild.className === 'none-of-the-above') {
			let checkbox = ulDiv.lastChild.firstChild.firstChild;
			if (checkbox.checked) {
				this.responses[qIdx] = {};
				checkbox.checked = false;
			}
		}
		// if no response yet, init
		if (!this.responses[qIdx]) this.responses[qIdx] = {};
		// then add
		let multiplier = e.target.checked ? 1 : -1;
		for (let p of Object.keys(personalities))
			this.responses[qIdx][p] = Math.max(0, (this.responses[qIdx][p] ?? 0) + multiplier * personalities[p]);
		console.log(this.responses);

	}

	noneOfTheAbove(qIdx, response = {}, ulDiv) {
		this.responses[qIdx] = response;
		// clear out all others
		for (let z = 0; z < ulDiv.children.length - 1; z++) {
			ulDiv.children[z].firstChild.firstChild.checked = false;
		}
		console.log(this.responses);

	}

	submit() {
		console.log(this.responses);
		let scores = Object.fromEntries(Object.keys(this.results).map(name => [name, 0]));
		for (const response of this.responses) {
			if (!response) continue;
			for (let [name, val] of Object.entries(response)) scores[name] += val;
		}
		let result = Object.entries(scores).sort((a, b) => b[1] - a[1]);
		this.div.appendChild(this.resultsDiv);
		this.renderResult(result);
		console.log(result);
		localStorage.setItem(this.quizID + 'QuizResult', JSON.stringify(result));
	}

	renderResult(result) {
		// check tie
		let tie = result.length > 1 && result[0][1] === result[1][1];
		this.resultsDiv.innerHTML = '';
		this.resultsDiv.appendChild(elt('p', { style: 'text-align: center' }, 'Your result is…'));
		if (tie) {
			this.resultsDiv.appendChild(elt('h1', { style: 'text-align: center' }, 'You got a tie!'));
			let list = elt('p', { style: 'text-align: center' }, 'Between ');
			let index = 0;
			while (index < result.length && result[index][1] === result[0][1]) {
				let name = result[index][0];
				if (index != 0) list.appendChild(document.createTextNode(', '));
				if (this.results[name].url) list.appendChild(elt('a', { href: this.results[name].url }, name));
				else list.appendChild(elt('span', {}, name));
				index++;
			}
			this.resultsDiv.appendChild(list);
			// loop again to display descs
			index = 0;
			while (index < result.length && result[index][1] === result[0][1]) {
				this.resultsDiv.appendChild(this.getPersonality(result[index][0]));
				index++;
			}
		} else {
			this.resultsDiv.appendChild(this.getPersonality(result[0][0]));
		}
		let olDiv = elt('ol');
		for (let z = 0; z < result.length; z++) {
			let name = result[z][0];
			olDiv.appendChild(elt('li', {}, elt('a', { href: this.results[name].url }, name), `: ${result[z][1]}`));
		}
		this.resultsDiv.appendChild(olDiv);
		this.resultsDiv.appendChild(elt('p', { style: 'text-align: center' }, elt('a', { href: "https://tofutush.leprd.space/guestbook/", target: "_blank", className: 'external-link' }, "Tell me your results!")));
		this.resultsDiv.appendChild(elt('p', { style: 'text-align: center' }, "Want to retry? Simply do the form and submit again!"));
	}

	getPersonality(name) {
		let div = elt('div');
		div.appendChild(elt('h1', { style: 'text-align: center' }, this.results[name].url ? elt('a', { href: this.results[name].url }, name) : elt('span', {}, name)));
		if (this.results[name].img) div.appendChild(elt('img', { src: this.results[name].img, className: 'max max-500' }));
		let desc = elt('p', { style: 'text-align: center' });
		desc.innerHTML = this.results[name].desc;
		div.appendChild(desc);
		return div;
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
function scanResults(quizContent) {
	const characters = Object.keys(quizContent.results);
	quizContent.questions.forEach((q, qi) => {
		// init totals to 0
		const totals = Object.fromEntries(characters.map(c => [c, 0]));
		// accumulate answer weights
		q.answers.forEach(a => {
			for (const [char, weight] of Object.entries(a.response)) totals[char] += weight;
		});
		// log totals
		console.log(`${qi + 1}. ${q.title}`);
		for (const char of characters) console.log(`  ${char}: ${totals[char]}`);
		// warn about zero-weight characters
		const zeroes = characters.filter(c => totals[c] === 0);
		if (zeroes.length) {
			console.warn(`Question ${qi + 1} has zero-weight characters:`, zeroes);
		}
	});
}

function elt(type, props, ...children) {
	let dom = document.createElement(type);
	if (props) Object.assign(dom, props);
	for (let child of children) {
		if (typeof child == "string") dom.appendChild(document.createTextNode(child));
		else dom.appendChild(child);
	}
	return dom;
}
