const oneElt = document.querySelector('.one');
const one = {
    img: oneElt.querySelector('img'),
    h3: oneElt.querySelector('h3'),
    p: oneElt.querySelector('p'),
    btn: oneElt.querySelector('button')
}

const twoElt = document.querySelector('.two');
const two = {
    img: twoElt.querySelector('img'),
    h3: twoElt.querySelector('h3'),
    p: twoElt.querySelector('p'),
    btn: twoElt.querySelector('button')
}

let idx = [];

window.onload = function () {
    randTwo();
    one.btn.addEventListener('click', choose(idx[1]));
    two.btn.addEventListener('click', choose(idx[1]));
    setBoth(idx);
}

function choose(idx) {
    return e => {
        oldData = [...data];
        data.splice(idx, 1);
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
    obj.p.innerText = data[id].desc;
}

function randTwo() {
    let idx1 = Math.floor(Math.random() * data.length);
    let idx2 = Math.floor(Math.random() * data.length);
    do {
        idx2 = Math.floor(Math.random() * data.length);
    } while (idx1 === idx2);
    idx = [idx1, idx2];
}