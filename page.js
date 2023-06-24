// max number of pages, used in the last comic button
const maxPageNum = 15;
// authors notes
const authorsNotes = {
	1: `<p>This is the start of The Iron Ragdoll! Thanks a lot for your willingness to give this a shot!</p>
		<p>The Iron Ragdoll is also available on MSPFA, Webtoons, Tapas and Globalcomix (see dropdown menu when hovering "Other" above). It would be so kind of you to leave comments on those platforms, or click the subscribe button!</p>
		<p>(I don't recommend doing all the reading there, though, especially on Webtoons and Tapas. They've got those funky size restrictions that make the images all blurry. But it would help me so much to drop by and leave some likes!)</p>`,
	3: `<p>Inconsistency Alert!!! Sparky keeps toggling between sitting in the left seat and sitting in the right. Sorry guys, but geez is this stuff hard. I do my best.</p>
        <p>Also, Sparky isn't wearing a seat belt the entire time. Please do buckle up.</p>`,
	4: `<p>They are not family. They look like family, but those two people are only like two years older than Sparky. You will meet them soon.</p>`,
	6: `<p>Okay, so that was like, a <i>really</i> quick representation of Hillslope. There's definitely going to be more stuff besides grass, buildings and a single road. But the important landmarks are there: two apartments, two small house-like things, and an abandoned, broken building.</p>`,
	8: `<p>Don't bother looking; the anklet is covered up by Sparky's huge pant sleeves. This is not an excuse for poor drawing (although the drawing <i>is</i> poor). It's actually her pants.</p>`,
	11: `<p>This page is drawn in Clip Studio Paint who actually cares about comics. I still love SAI2, but despite that, creating comics in it was a nightmare. I'm still going to do most of my other drawings in SAI2 (including Forty Donuts) but for comics I'm using CSP.</p>
		 <p>And yeah, I will eventually redraw the previous pages in CSP too, but right now it's too early to be turning back.</p>`,
};
// background stuff
const BGStuff = {
    0: ['forest-night', '#fff'],
};

window.onload = function() {
    console.log('loaded');
    window.url = new URLSearchParams(window.location.search);
    window.pagenum = Math.max(0, Number(url.get('page') || 0));
    window.options = document.querySelectorAll('.options');
    if(maxPageNum < pagenum) return;
    changeThingInMiddle(pagenum);
    setImage(pagenum);
    changeBG(pagenum);
    addANotes(pagenum);
    pageLinx();
    doNoClicks();
    saveButtons();
    arrowNavigation();
}

function arrowNavigation() {
    document.body.addEventListener('keydown', e => {
        if(e.key == 'ArrowLeft') // left arrow
            this.flipPage('prev');
        if(e.key == 'ArrowRight') // right arrow
            this.flipPage('next');
    });
}

function saveButtons() {
    let save = document.getElementById('save').children;
    save[0].addEventListener('click', e => {
        localStorage.setItem('place', pagenum);
        alert(`Page ${pagenum} saved!`);
    });
    save[1].addEventListener('click', e => {
        let place = localStorage.getItem('place');
        if(place) flipPage(place);
        else alert('no place was saved!');
    });
}

function pageLinx() {
    for(let option of options) {
        a = option.children;
        a[0].addEventListener('click', e => {
            flipPage(0);
        });
        a[1].addEventListener('click', e => {
            flipPage('prev');
        });
        a[3].addEventListener('click', e => {
            flipPage('next');
        });
        a[4].addEventListener('click', e => {
            flipPage(maxPageNum);
        });
    }
}

// flip page without refresh; num can be number or "next" or "prev"
function flipPage(num) {
    if(num == 'next') num = Math.min(maxPageNum, pagenum + 1);
    if(num == 'prev') num = Math.max(0, pagenum - 1);
    if(num == pagenum || num > maxPageNum) return;
    window.scrollTo(0, 0);
    window.history.pushState({}, null, `?page=${num}`);
    document.title = `The Iron Ragdoll | Page ${num}`;
    changeThingInMiddle(num);
    setImage(num);
    changeBG(num);
    addANotes(num);
    pagenum = num;
    doNoClicks();
}

function preLoad(num) {
    let img = new Image();
    img.url = getImgUrl(num);
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

function addANotes(num) {
    // authors notes
    let el = document.getElementById('note');
    let note = authorsNotes[num];
    if(note) {
        el.innerHTML = note;
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
    // translation
    // stupid encoding keeps eating my translations.
    // document.getElementById('translation').children[0].innerHTML = translation[num];
}

function changeThingInMiddle(num) {
    // full fledge single letter variable mode but i dont care
    let q = document.querySelectorAll('.pagenum')
    for(let w of q) {
        w.children[0].innerText = 'Page ' + num;
    };
}

function setImage(num) {
    document.getElementById('img').children[0].src = getImgUrl(num);
}

function changeBG(num) {
    while(!BGStuff[num]) num--;
    document.body.style.backgroundImage = `url(bg/${BGStuff[num][0]}.png)`;
    let root = document.querySelector(':root');
    root.style.setProperty('--text', BGStuff[num][1]);
}

function getImgUrl(num) {
    return String(Math.floor(num / 100) + '/' + num + '.png');
}

// code from Grepper
function clearEventListeners(el) {
    clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
}

function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}