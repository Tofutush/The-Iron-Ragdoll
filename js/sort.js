// inspired by Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

class SortTable {
	constructor(table) {
		this.table = table;
		this.firstRow = table.querySelector('thead tr');
		this.theads = this.firstRow.children;
		this.tbody = table.querySelector('tbody');
		this.rows = this.tbody.rows;
	}
	removeAllClasses() {
		for (let z = 0; z < this.theads.length; z++) {
			this.theads[z].classList.remove('sorted');
			this.theads[z].classList.remove('sorted-reverse');
		}
	}
	addSort({ colName, keyFunc, sortFunc }) {
		for (let z = 0; z < this.theads.length; z++) {
			if (colName === this.theads[z].innerText) {
				let th = this.theads[z];
				th.classList.add('sortable');
				let rowArray = [];
				for (let x = 0; x < this.rows.length; x++) {
					rowArray.push({ key: keyFunc(this.rows[x].children[z]), elt: this.rows[x] });
				}
				let sortDesc = rowArray.slice().sort((a, b) => sortFunc(a.key, b.key));
				let sortAsc = rowArray.slice().sort((a, b) => sortFunc(a.key, b.key)).reverse();
				while (sortDesc[sortDesc.length - 1].key === '') sortDesc.unshift(sortDesc.pop());
				while (sortAsc[sortAsc.length - 1].key === '') sortAsc.unshift(sortAsc.pop());
				th.addEventListener('click', e => {
					if (th.classList.contains('sorted')) {
						for (let z = sortAsc.length - 1; z >= 0; z--)
							this.tbody.appendChild(sortDesc[z].elt);
						this.removeAllClasses();
						th.classList.add('sorted-reverse');
					} else {
						for (let z = sortAsc.length - 1; z >= 0; z--)
							this.tbody.appendChild(sortAsc[z].elt);
						this.removeAllClasses();
						th.classList.add('sorted');
					}
				});
			}
		}
	}
	// sort funcs
	static sortFuncNumber(a, b) {
		return a - b;
	}
	static sortFuncString(a, b) {
		return a.localeCompare(b);
	}
	static sortFuncZh(a, b) {
		return a.localeCompare(b, 'zh-CN');
	}
	static sortFuncHSL(a, b) {
		return (a.h === b.h) ? ((a.s === b.s) ? a.l - b.l : a.s - b.s) : a.h - b.h;
	}
	static RGBToHSL(rgb) {
		let r, g, b;
		let m = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if (m) {
			r = m[1];
			g = m[2];
			b = m[3];
		}
		r /= 255; g /= 255; b /= 255;
		let max = Math.max(r, g, b);
		let min = Math.min(r, g, b);
		let d = max - min;
		let h;
		if (d === 0) h = 0;
		else if (max === r) h = (g - b) / d % 6;
		else if (max === g) h = (b - r) / d + 2;
		else if (max === b) h = (r - g) / d + 4;
		let l = (min + max) / 2;
		let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
		return { h: h * 60, s, l };
	}
}
