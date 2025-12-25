class Quiz {
	constructor(div, quizContent) {
		this.div = div;
		this.desc = quizContent.desc;
		this.questions = quizContent.questions;
		this.answers = quizContent.answers;
		this.randomize = quizContent.randomize;
	}

	init() {
		this.div.appendChild(elt('p', {}, this.desc));
		// questions
		let bigQDiv = elt('div');
		for (let z = 0; z < this.questions.length; z++) {
			bigQDiv.appendChild(elt('hr'));
			let q = this.questions[z];
			let questionDiv = elt('div', { className: 'question' });
			questionDiv.appendChild(elt('ol', { start: z + 1 }, elt('li', {}, elt('strong', {}, q.title))));
			let ulDiv = elt('ul');
			for (let x = 0; x < q.answers.length; x++) {
				let a = q.answers[x];
				let inputDiv = elt('input', { name: 'q' + z, type: 'radio' });
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
		this.div.appendChild(elt('button', { style: 'display: block; margin: auto', onclick: this.submit }, 'Submit!'));
	}
	submit() {
		console.log('submitted');

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
