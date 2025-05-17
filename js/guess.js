class Game {
    constructor(chs, imgs, rels) {
        this.chs = chs;
        this.imgs = imgs;
        this.rels = rels;

        this.lastQuestion = {};
        this.rounds = 0;
        this.lives = 3;

        this.newGameButton = document.getElementById('new-game');
        this.gameDiv = document.getElementById('game');
        this.roundDiv = document.getElementById('round');
        this.livesDiv = document.getElementById('lives');
        this.chImg = document.getElementById('ch');
        this.relText = document.getElementById('rel');
        this.optionElt = document.getElementById('options');
    }

    startGame() {
        this.newGameButton.style.display = 'none';
        this.gameDiv.style.display = 'block';
        this.displayQuestion();
    }
    displayQuestion() {
        this.roundDiv.innerText = this.rounds;
        this.livesDiv.innerText = this.lives;
        this.getQuestion();
        this.getOptions();
        this.chImg.src = this.imgs[this.question.ch];
        this.relText.innerHTML = this.question.rel;
        this.optionElt.innerHTML = '';
        for (let z = 0; z < this.options.length; z++) {
            let img = elt('button', {}, elt('img', { src: this.imgs[this.options[z]] }));
            img.addEventListener('click', e => {
                this.rounds++;
                if (this.options[z] !== this.question.answer) {
                    this.lives--;
                }
                this.displayQuestion();
            });
            this.optionElt.appendChild(img);
        }
    }
    getOptions() {
        this.options = [this.question.answer];
        for (let z = 0; z < this.rounds % 10 + 1; z++) {
            let falseOption;
            do falseOption = this.chs[randomInRange(0, this.chs.length)]
            while (this.options.includes(falseOption));
            this.options.push(falseOption);
        }
    }
    getQuestion() {
        do {
            let rel = this.rels[randomInRange(0, this.rels.length)];
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

let game = new Game(chs, imgs, rels);
function startGame() {
    game.startGame();
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
