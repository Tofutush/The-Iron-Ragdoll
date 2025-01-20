class Filter {
	constructor(element) {
		this.divs = element.children;
		this.filter = [];
		this.tags = document.querySelector('.tags').children;
	}
	filtering() {
		for (let z = 0; z < this.tags.length; z++) {
			this.tags[z].addEventListener('click', e => {
				if (this.tags[z].classList.contains('active')) {
					this.tags[z].classList.remove('active');
					this.filter.splice(this.filter.indexOf(this.tags[z].getAttribute('name')), 1);
				} else {
					if (e.shiftKey) {
						this.tags[z].classList.add('active');
						this.filter.push(this.tags[z].getAttribute('name'));
					} else {
						for (let x = 0; x < this.tags.length; x++) {
							this.tags[x].classList.remove('active');
						}
						this.tags[z].classList.add('active');
						this.filter = [this.tags[z].getAttribute('name')];
					}
				}
				for (let z = 0; z < this.divs.length; z++) {
					let tags = this.divs[z].getAttribute('tags').split(' ');
					if (this.filter.every(f => tags.includes(f.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "-")))) {
						this.divs[z].classList.remove('hidden');
					} else {
						this.divs[z].classList.add('hidden');
					}
				}
			});
		}
	}
}
