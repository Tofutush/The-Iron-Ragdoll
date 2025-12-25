class Quiz {
	constructor(div, quizContent) {
		this.div = div;
		this.desc = quizContent.desc;
		this.questions = quizContent.questions;
		this.results = quizContent.results;
		this.randomize = quizContent.randomize;

		this.responses = [];
		this.resultsDiv = elt('div', { id: 'results' });
	}

	init() {
		this.div.appendChild(elt('p', {}, this.desc));
		this.div.appendChild(elt('p', { className: 'graybox' }, 'Select an answer for the options below. You can also leave questions empty. Some questions may be multi-select, and will be marked as such.'));
		// questions
		let bigQDiv = elt('div', { id: 'questions' });
		for (let z = 0; z < this.questions.length; z++) {
			bigQDiv.appendChild(elt('hr'));
			let q = this.questions[z];
			let questionDiv = elt('div', { className: 'question' });
			questionDiv.appendChild(elt('ol', { start: z + 1 }, elt('li', {}, elt('strong', {}, q.title))));
			let ulDiv = elt('ul');
			if (this.randomize) shuffle(q.answers);
			for (let x = 0; x < q.answers.length; x++) {
				let a = q.answers[x];
				let inputDiv = elt('input', { name: 'q' + z, type: 'radio', onchange: e => this.setAnswer(z, a.response) });
				let labelDiv = elt('label', {}, inputDiv, a.text);
				let liDiv = elt('li', {}, labelDiv);
				ulDiv.appendChild(liDiv);
			}
			questionDiv.appendChild(ulDiv);
			bigQDiv.appendChild(questionDiv);
		}
		this.div.appendChild(bigQDiv);
		// submit
		this.div.appendChild(elt('hr'));
		this.div.appendChild(elt('button', { style: 'display: block; margin: auto', onclick: () => this.submit() }, 'Submit!'));
		this.div.appendChild(this.resultsDiv);
		if (localStorage.getItem('mssQuizResult')) this.renderResult(localStorage.getItem('mssQuizResult'));
	}

	setAnswer(qIdx, personalities) {
		this.responses[qIdx] = personalities;
	}

	submit() {
		let result = [];
		for (let idx in Object.keys(this.results)) result[idx] = [Object.keys(this.results)[idx], 0];
		for (let z = 0; z < this.responses.length; z++) {
			if (this.responses[z]) {
				for (let personality of Object.keys(this.responses[z])) {
					result.find(r => r[0] === personality)[1] += this.responses[z][personality];
				}
			}
		}
		result.sort((a, b) => b[1] - a[1]);
		this.renderResult(result);
	}

	renderResult(result) {
		console.log(result);

		// check tie
		let tie = false;
		if (result[0][1] === result[1][1]) tie = true;
		this.resultsDiv.innerHTML = '';
		this.resultsDiv.appendChild(elt('p', { style: 'text-align: center' }, 'Your result is…'));
		if (tie) {
			this.resultsDiv.appendChild(elt('h1', { style: 'text-align: center' }, 'You got a tie!'));
		} else {
			let name = result[0][0];
			this.resultsDiv.appendChild(elt('h1', { style: 'text-align: center' }, elt('a', { href: this.results[name].url }, name)));
			this.resultsDiv.appendChild(elt('img', { src: this.results[name].img, className: 'max max-500' }));
			this.resultsDiv.appendChild(elt('p', { style: 'text-align: center' }, this.results[name].desc));
		}
	}
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
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
