const oneElt = document.querySelector('.one');
const one = {
    img: oneElt.querySelector('img'),
    h3: oneElt.querySelector('h3'),
    p: oneElt.querySelector('p'),
    vs: document.querySelector('.V')
}

const twoElt = document.querySelector('.two');
const two = {
    img: twoElt.querySelector('img'),
    h3: twoElt.querySelector('h3'),
    p: twoElt.querySelector('p'),
    vs: document.querySelector('.S')
}

let idx = [], totalCount = data.length;

window.onload = function () {
    randTwo();
    one.img.addEventListener('click', eliminate(true));
    two.img.addEventListener('click', eliminate(false));
    setBoth(idx);
}

function eliminate(which) {
    return e => {
        if (which === true) data.splice(idx[1], 1); // eliminate two
        else data.splice(idx[0], 1); //eliminate one
        if (data.length <= 1) displayResult();
        let progress = (totalCount - data.length) / totalCount * 100;
        document.querySelector('.progress-bar').style.background = `linear-gradient(to right, var(--c) ${progress}%, var(--box) ${progress}%)`;
        randTwo();
        setBoth();
    }
}

function setBoth() {
    setDisplay(one, idx[0]);
    setDisplay(two, idx[1]);
}

function setDisplay(obj, id) {
    obj.img.src = data[id].img;
    obj.h3.innerText = data[id].name;
    obj.h3.style.color = data[id].color;
    obj.vs.setAttribute('stroke', data[id].color);
    obj.p.innerText = data[id].desc;
}

function displayResult() {
    document.querySelector('.picker').style.display = 'none';
    const result = document.querySelector('.result');
    result.querySelector('img').src = data[0].img;
    result.style.display = 'block';
    const link = result.querySelector('.fav');
    link.innerText = data[0].name;
    link.href = `../../characters/${data[0].name.toLowerCase()}/`;
    throw new Error('game ended');
}

function randTwo() {
    if (data.length === 2) {
        idx = [0, 1];
        return;
    }
    let idx1 = Math.floor(Math.random() * data.length);
    let idx2 = Math.floor(Math.random() * data.length);
    do {
        idx2 = Math.floor(Math.random() * data.length);
    } while (idx1 === idx2);
    idx = [idx1, idx2];
}