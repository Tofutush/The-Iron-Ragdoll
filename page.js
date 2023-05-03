// max number of pages, used in the last comic button
const maxPageNum = 3;

window.onload = function() {
    console.log('loaded');
    window.url = new URLSearchParams(window.location.search);
    window.pagenum = Math.max(0, Number(url.get('page') || 0));
    window.options = document.querySelectorAll('.options');
    changeThingInMiddle(pagenum);
    setImage(pagenum);
    pageLinx();
    doNoClicks();
    saveButtons();
}

function saveButtons() {
    let save = document.getElementById('save').children;
    save[0].addEventListener('click', e => {
        localStorage.setItem('place', pagenum);
        alert(`Page ${pagenum} saved!`);
    });
    save[1].addEventListener('click', e => {
        let place = localStorage.getItem('place');
        if(place)
            flipPage(place);
        else
            alert('no place was saved!');
    });
}

function pageLinx() {
    for(let option of options) {
        a = option.children;
        a[0].addEventListener('click', e => {
            flipPage(0);
        });
        a[1].addEventListener('click', e => {
            flipPage(Math.max(0, pagenum - 1));
        });
        a[3].addEventListener('click', e => {
            flipPage(Math.min(maxPageNum, pagenum + 1));
        });
        a[4].addEventListener('click', e => {
            flipPage(maxPageNum);
        });
    }
}

function flipPage(num) {
    if(num == pagenum) return;
    window.scrollTo(0, 0);
    window.history.pushState({}, null, `?page=${num}`);
    document.title = `Prospit's Requiem | Page ${num}`;
    changeThingInMiddle(num);
    setImage(num);
    pagenum = num;
    doNoClicks();
}

function doNoClicks() {
    for(let option of options) {
        let a = option.children;
        if(pagenum == 0) {
            a[0].className = a[1].className = 'noclick';
        } else {
            a[0].className = a[1].className = '';
        };
        if(pagenum == maxPageNum) {
            a[3].className = a[4].className = 'noclick';
        } else {
            a[3].className = a[4].className = '';
        }
    }
}

function changeThingInMiddle(num) {
    // full fledge single letter variable mode but i dont care
    let q = document.querySelectorAll('.pagenum')
    for(let w of q) {
        w.children[0].innerText = 'Page ' + num;
    };
}

function setImage(num) {
    document.getElementById('img').children[0].src = String(Math.floor(num / 100) + '/' + num + '.png');
}

// code from Grepper
function clearEventListeners(el) {
    clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
}

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}