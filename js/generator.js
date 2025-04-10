// TODO: write docs

class Generator {
    constructor(placeholders, prompts) {
        this.placeholders = placeholders;
        this.prompts = prompts;
    }
    randomInRange(a, b) {
        a = parseInt(a);
        b = parseInt(b);
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    generate() {
        let rolled = this.prompts[this.randomInRange(0, this.prompts.length - 1)];
        let phs = rolled.match(/\%(?:[a-zA-Z]+)(?:\/[a-zA-Z]+)*(?:\|[0-9]+-[0-9]+)?\%/g);
        for (let z = 0; z < phs.length; z++) {
            let placeholder = phs[z];
            let split = placeholder.substring(1, placeholder.length - 1).split('|');
            let ids = split[0].split('/');
            let phList = [];
            for (let x = 0; x < ids.length; x++) {
                for (let c = 0; c < this.placeholders.length; c++) {
                    if (this.placeholders[c].id === ids[x]) {
                        phList.push(this.placeholders[c]);
                        break;
                    }
                }
            }
            let count = split[1] ? this.randomInRange(split[1].split('-')[0], split[1].split('-')[1]) : 1;
            let results = [];
            for (let x = 0; x < count; x++)
                results.push(phList[this.randomInRange(0, phList.length - 1)].roll());
            let string = '';
            for (let x = 0; x < results.length; x++)
                string += results[x] + (x === results.length - 1 ? '' : (x === results.length - 2 ? (results.length > 2 ? ', and ' : ' and ') : ', '));
            rolled = rolled.replace(phs[z], string).replace('  ', ' ');
        }
        return rolled;
    }
}

class GeneratorPlaceholder {
    constructor(id, replacements, allowRepeats = false) {
        this.id = id;
        if (!/[a-zA-Z]/.test(id)) {
            throw new Error(`${id} isnt a valid id. it should only contain a-z upper or lowercase i actually could let more characters in but i dont want to`);
        }
        this.replacements = replacements;
        this.allowRepeats = allowRepeats;
        this.alreadyRolled = [];
    }
    roll() {
        let rolled = this.replacements[Math.floor(Math.random() * this.replacements.length)];
        if (!this.allowRepeats) {
            while (this.alreadyRolled.includes(rolled)) {
                rolled = this.replacements[Math.floor(Math.random() * this.replacements.length)];
            }
            this.alreadyRolled.push(rolled);
            if (this.alreadyRolled.length == this.replacements.length) {
                this.clearAlreadyRolled();
            }
        }
        return rolled;
    }
    clearAlreadyRolled() {
        this.alreadyRolled = [];
    }
}
