// the generator that generates anything. needs to be used with the generator placeholder class

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
        let phs = rolled.match(/\%(?:[a-zA-Z]+)(?:\/[a-zA-Z]+)*(?:\|[1-9]+-[0-9]+)?\%/g);
        console.log(phs);

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
            for (let x = 0; x < count; x++) {
                results.push(phList[this.randomInRange(0, phList.length - 1)].roll());
            }
            let string = '';
            for (let x = 0; x < results.length; x++) {
                if (x === results.length - 1) {
                    string += results[x];
                } else if (x === results.length - 2) {
                    if (results.length > 2) {
                        string += results[x] + ', and ';
                    } else {
                        string += results[x] + ' and ';
                    }
                } else {
                    string += results[x] + ', ';
                }
            }
            rolled = rolled.replace(phs[z], string);
        }
        return rolled;
    }
}
