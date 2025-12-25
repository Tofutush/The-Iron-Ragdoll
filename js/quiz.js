class Quiz {
	constructor(div, quizContent) {
		this.div = div;
		this.desc = quizContent.desc;
		this.questions = quizContent.questions;
		this.results = quizContent.results;
		this.randomize = quizContent.randomize;

		this.responses = [];
	}

	init() {
		this.div.appendChild(elt('p', {}, this.desc));
		this.div.appendChild(elt('p', { className: 'graybox' }, 'Select an answer for the options below. You can also leave questions empty. Some questions may be multi-select, and will be marked as such.'));
		// questions
		let bigQDiv = elt('div');
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
		console.log(result);

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
