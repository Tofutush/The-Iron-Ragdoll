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
    randTwo(data.length);
    one.btn.addEventListener('click', choose(idx[1]));
    two.btn.addEventListener('click', choose(idx[1]));
    setBoth(idx);
}

function choose(idx) {
    return e => {
        console.log(data);

        data.splice(idx, 1);
        console.log(data);

        randTwo();
        setBoth();
    }
}

function setBoth() {
    setDisplay(one, idx[0]);
    setDisplay(two, idx[1]);
}

function setDisplay(obj, idx) {
    obj.img.src = data[idx].img;
    obj.h3.innerText = data[idx].name;
    obj.h3.style.color = data[idx].color;
    obj.p.innerText = data[idx].desc;
}

function randTwo(length) {
    let idx1 = Math.floor(Math.random() * length);
    let idx2 = Math.floor(Math.random() * length);
    do {
        idx2 = Math.floor(Math.random() * length);
    } while (idx1 === idx2);
    idx = [idx1, idx2];
}