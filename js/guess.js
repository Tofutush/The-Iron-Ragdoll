class Game {
    constructor(chs, imgs, rels) {
        this.chs = chs;
        this.imgs = imgs;
        this.rels = rels;

        this.lastQuestion = {};
        this.rounds = 1;
        this.lives = 3;

        this.newGameButton = document.getElementById('new-game');
        this.gameDiv = document.getElementById('game');
        this.statsDiv = document.getElementById('stats');
        this.correctDiv = document.getElementById('correct');
        this.incorrectDiv = document.getElementById('incorrect');
        this.restartDiv = document.getElementById('restart');
        this.roundDiv = document.getElementById('round');
        this.livesDiv = document.getElementById('lives');
        this.chImg = document.getElementById('ch');
        this.relText = document.getElementById('rel');
        this.optionElt = document.getElementById('options');
    }

    startGame() {
        hide(this.newGameButton);
        show(this.gameDiv);
        show(this.statsDiv);
        this.roundDiv.innerText = this.rounds;
        this.displayQuestion();
    }
    displayQuestion() {
        hide(this.incorrectDiv);
        hide(this.correctDiv);
        this.getQuestion();
        this.getOptions();
        this.chImg.src = this.imgs[this.question.ch];
        this.relText.innerHTML = this.question.rel;
        this.optionElt.innerHTML = '';
        for (let z = 0; z < this.options.length; z++) {
            let img = elt('button', {}, elt('img', { src: this.imgs[this.options[z]] }));
            img.addEventListener('click', e => {
                hide(this.gameDiv);
                if (!this.answerCorrect(this.options[z])) {
                    this.lives--;
                    this.livesDiv.children[0] && this.livesDiv.removeChild(this.livesDiv.children[0]);
                    show(this.incorrectDiv);
                    if (this.lives <= 0) {
                        hide(this.statsDiv);
                        show(this.restartDiv);
                        document.getElementById('score').innerHTML = this.rounds;
                        return;
                    }
                } else show(this.correctDiv);
                this.rounds++;
                this.roundDiv.innerText = this.rounds;
                setTimeout(() => this.displayQuestion(), 500);
            });
            this.optionElt.appendChild(img);
        }
        show(this.gameDiv);
    }
    answerCorrect(option) {
        let findRel = this.rels.filter(r => r[0][0] === this.question.ch && r[1][0] === option
            || r[1][0] === this.question.ch && r[0][0] === option);
        return findRel.length === 1 && findRel[0].filter(r => r[0] === option)[0][1] === this.question.rel;
    }
    getOptions() {
        this.options = [this.question.answer];
        for (let z = 0; z < Math.floor(this.rounds / 5) + 1; z++) {
            let falseOption;
            do falseOption = this.chs[randomInRange(0, this.chs.length - 1)]
            while (this.options.includes(falseOption) || this.question.ch === falseOption);
            this.options.push(falseOption);
        }
        shuffle(this.options);
    }
    getQuestion() {
        do {
            let rel = this.rels[randomInRange(0, this.rels.length - 1)];
            let coin = randomInRange(0, 1);
            this.question = (coin === 0) ? {
                ch: rel[0][0],
                rel: rel[1][1],
                answer: rel[1][0]
            } : {
                ch: rel[1][0],
                rel: rel[0][1],
                answer: rel[0][0]
            };
        } while (this.lastQuestion &&
            (this.lastQuestion.ch == this.question.ch &&
                this.lastQuestion.rel == this.question.rel)
        );
    }
}

let game = new Game(data.ch, imgs, data.rel);
function startGame() {
    game.startGame();
}

function hide(elt) {
    elt.style.display = 'none';
}
function show(elt) {
    elt.style.display = 'block';
}
function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
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
