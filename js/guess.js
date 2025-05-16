function startGame() {
    document.getElementById('new-game').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    let rounds = 0;
    let lives = 3;
    while (lives > 0) {
        let q = getQuestion();
        console.log(q);

        displayQuestion(q);
    }
}
function displayQuestion(q) {
    document.getElementById('ch').src = imgs[q.ch];
    document.getElementById('rel').innerHTML = q.rel;
}
function getQuestion() {
    let question;
    do {
        let rel = rels[randomInRange(0, rels.length)];
        let coin = randomInRange(0, 1);
        question = (coin === 0) ? {
            ch: rel[0][0],
            rel: rel[1][1],
            answer: rel[1][0]
        } : {
            ch: rel[1][0],
            rel: rel[0][1],
            answer: rel[0][0]
        };
    } while (question && lastQuestion &&
        (lastQuestion.ch !== question.ch ||
            lastQuestion.answer !== question.answer)
    );
    return question;
}

function randomInRange(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
