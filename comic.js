/*
- comicName: string, name of comic
- minPageNum: int, defaults to 0 but can be anything
- maxPageNum: int, the last page the reader is supposed to see
- pageNum: int, the current page
- pageNumDisplays: htmlcollection, the "Page x" thing at the top and bottom (only the number)
- imgElement: the comic img
- ANoteDiv: the div of the authors notes div
- navigators: htmlcollection, the back and forward arrows
- saveButton: array, first one is save button, second one is load button
- theme: object, tells you when to change bg and text color all that
- whereToScrollTo: string, no # at front, anchor of picture
- getImgUrl: function, how to get img url?
- updateTheme: function, how do you update your theme?
*/

class Comic {
	constructor(comicName,
		minPageNum,
		maxPageNum,
		pageNum,
		pageNumDisplays,
		imgElement,
		ANotesDiv,
		navigators,
		saveButton,
		theme,
		whereToScrollTo,
		episodes,
		getImgUrl,
		updateTheme) {
		this.name = comicName;
		this.minPageNum = minPageNum || 0;
		if(!Number.isInteger(this.minPageNum)) throw new Error(`minPageNum is ${this.minPageNum} and not an integer number stupid`);
		this.maxPageNum = maxPageNum;
		if(!Number.isInteger(this.maxPageNum)) throw new Error(`maxPageNum is ${this.maxPageNum} and not an integer number stupid`);
		this.pageNum = pageNum;
		if(!Number.isInteger(this.pageNum)) {
			this.pageNum = this.minPageNum;
		};
		this.pageNumDisplays = pageNumDisplays;
		this.imgElement = imgElement;
		this.ANotesDiv = ANotesDiv;
		this.navigators = navigators;
		this.saveButton = saveButton;
		this.theme = theme;
		this.whereToScrollTo = whereToScrollTo;
		this.episodes = episodes;
		this.getImgUrl = getImgUrl;
		this.updateTheme = updateTheme;
		this.doInit();
	}
	
	doInit() {
		if(!this.withinRange(this.pageNum)) this.flipPage(0);
		// first time, manual flip
		this.changeNumberInMiddle(this.pageNum);
		this.setImage(this.pageNum);
		this.changeBG(this.pageNum);
		this.addANotes(this.pageNum);
		this.pageLinx();
		this.doNoClicks();
		this.saveButtons();
		this.arrowNavigation();
		this.typeNumberNavigation();
	}

	// flip page without refresh. checks everything
	flipPage(num, prev, next) {
		if(prev && next) throw new Error('do you want prev or next? make up your fucking mind');
		// set num if prev or next
		if(next) num = Math.min(this.maxPageNum, this.pageNum + 1);
		else if(prev) num = Math.max(this.minPageNum, this.pageNum - 1);
		// set num if not in range
		if(!this.withinRange(this.pageNum)) num = this.minPageNum;
		// go away if not number or no need 2 flip
		if(isNaN(num) || num == this.pageNum) return;
		// remove stuff after decimal
		num = Math.floor(num);
		window.history.pushState({}, null, `?page=${num}`);
		location.hash = `#${this.whereToScrollTo}`; // scroll to comic
		document.title = `${this.name} | Page ${num}`;
		this.changeNumberInMiddle(num);
		this.preloadImg(num - 1);
		this.preloadImg(num + 1);
		this.setImage(num);
		this.changeBG(num);
		this.addANotes(num);
		this.pageNum = num;
		this.doNoClicks();
	}

	withinRange(num) {
		if(isNaN(num)) return;
		return num >= 0 && num <= maxPageNum;
	}

	changeNumberInMiddle(num) {
		for(let q of this.pageNumDisplays) {
			q.innerText = num;
		};
	}

	// does this even fucking work?
	preloadImg(num) {
		let img = new Image();
		img.url = this.getImgUrl(num);
	}

	setImage(num) {
		this.imgElement.src = this.getImgUrl(num);
	}

	changeBG(num) {
		while(!this.theme[num]) {
			num--;
			if(num < this.minPageNum || !Number.isInteger(num)) throw new Error('num is so wrong maybe its below minPageNum meybe its not an integer number');
		}
		this.updateTheme(this.theme[num]);
	}

	// authors notes
	addANotes(num) {
		let note = authorsNotes[num];
		if(note) {
			this.ANotesDiv.innerHTML = note;
			this.ANotesDiv.style.display = 'block';
		} else {
			this.ANotesDiv.style.display = 'none';
		}
	}

	pageLinx() {
		for(let option of this.navigators) {
			let a = option.children;
			a[0].addEventListener('click', e => {
				this.flipPage(this.minPageNum);
			});
			a[1].addEventListener('click', e => {
				this.flipPage(0, true);
			});
			a[3].addEventListener('click', e => {
				this.flipPage(0, false, true);
			});
			a[4].addEventListener('click', e => {
				this.flipPage(this.maxPageNum);
			});
		}
	}

	doNoClicks() {
		for(let option of this.navigators) {
			let a = option.children;
			if(this.pageNum == this.minPageNum) {
				a[0].className = a[1].className = 'noclick';
			} else {
				a[0].className = a[1].className = '';
			};
			if(this.pageNum == this.maxPageNum) {
				a[3].className = a[4].className = 'noclick';
			} else {
				a[3].className = a[4].className = '';
			}
		}
	}

	saveButtons() {
		this.saveButton[0].addEventListener('click', e => {
			localStorage.setItem('place', this.pageNum);
			alert(`Page ${this.pageNum} saved!`);
		});
		this.saveButton[1].addEventListener('click', e => {
			let place = localStorage.getItem('place');
			if(place) flipPage(place);
			else alert('no place was saved!');
		});
	}

	arrowNavigation() {
		document.body.addEventListener('keydown', e => {
			if(e.key == 'ArrowLeft') // left arrow
				this.flipPage(0, true);
			if(e.key == 'ArrowRight') // right arrow
				this.flipPage(0, false, true);
		});
	}

	typeNumberNavigation() {
		for(let w of this.pageNumDisplays) {
			w.addEventListener('keydown', e => {
				if(e.key == 'Enter') {
					e.preventDefault();
					let num = parseInt(w.innerText);
					let str = w.innerText.toLowerCase();
					if(!isNaN(num) && this.withinRange(num) && num != this.pageNum) {
						console.log('is valid number');
						this.flipPage(num);
						return;
					} else if(str == 'last') {
						this.flipPage(this.maxPageNum);
						return;
					} else if(str == 'first') {
						this.flipPage(this.minPageNum);
						return;
					} else if(this.episodes) {
						for(let ch of this.episodes) {
							for(let z = 1; z < ch.length; z++) {
								for(let ep of ch[z]) {
									if(ep[3] > this.maxPageNum) return;
									if(ep[0] == str) {
										console.log(ep);
										this.flipPage(ep[3]);
										return;
									}
								}
							}
						}
					}
					console.log('no, go bakc');
					w.innerText = this.pageNum;
					// if() {
					// 	if() this.flipPage(num);
					// 	else w.innerText = this.pageNum;
					// } else {
					// 	if(str == 'last') {
					// 		this.flipPage(this.maxPageNum);
					// 	} else if (str == 'first') {
					// 		this.flipPage(this.minPageNum);
					// 	} else if(this.episodes) {
					// 		for(let ch of this.episodes) {
					// 			for(let z = 1; z < ch.length; z++) {
					// 				if(z[0] == str) {
					// 					this.flipPage(z[2]);
					// 					return;
					// 				}
					// 			}
					// 		}
					// 	}
					// }
				}
			});
		}
	}
}