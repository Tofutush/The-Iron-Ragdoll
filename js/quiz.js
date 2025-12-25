class Quiz {
	constructor(div, questions, answers, randomize) {
		this.div = div;
		this.questions = questions;
		this.answers = answers;
		this.randomize = randomize;
	}

	init() {

	}
}

let quiz = new Quiz(document.getElementById('quiz'), quizContent.questions, quizContent.answers, quizContent.randomize);