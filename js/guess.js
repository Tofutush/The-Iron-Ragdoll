let lastQuestion;
let rounds = 0;
let lives = 3;

function startGame() {
    document.getElementById('new-game').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    displayQuestion();
}
function displayQuestion() {
    let q = getQuestion();
    let options = getOptions(q, rounds);
    document.getElementById('ch').src = imgs[q.ch];
    document.getElementById('rel').innerHTML = q.rel;
    let optionElt = document.getElementById('options');
    optionElt.innerHTML = '';
    for (let z = 0; z < options.length; z++) {
        let img = elt('img', { src: imgs[options[z]] });
        optionElt.appendChild(img);
    }
}
function getOptions(q, rounds) {
    let options = [q.answer];
    for (let z = 0; z < rounds % 10 + 1; z++) {
        let falseOption;
        do {
            falseOption = chs[randomInRange(0, chs.length)]
        } while (options.includes(falseOption))
        options.push(falseOption);
    }
    return options;
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
    } while (lastQuestion !== undefined &&
        (lastQuestion.ch !== question.ch ||
            lastQuestion.rel !== question.rel)
    );
    return question;
}

function randomInRange(a, b) {
    a = parseInt(a);
    b = parseInt(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
function elt(name, attrs, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    for (let child of children) {
        dom.appendChild(child);
    }
    return dom;
}
