// TODO: write docs

class Generator {
    /**
     * Description
     * @param {GeneratorPlaceholder[]} placeholders - a list of GeneratorPlaceholders
     * @param {string[]} prompts - prompts, with &placeholderNames%
     * @returns {void}
     */
    constructor(placeholders, prompts) {
        this.placeholders = placeholders;
        this.prompts = new Gacha(prompts);
    }
    /**
     * Description - a random number in a range. can be strings too
     * @param {any} a
     * @param {any} b
     * @returns {number}
     */
    randomInRange(a, b) {
        a = parseInt(a);
        b = parseInt(b);
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
    generate() {
        // roll a prompt
        let rolled = this.prompts.roll();
        // what we got last time, for reference outside
        this.lastRolled = {
            prompt: rolled,
            results: []
        };
        // list all %things% inside the rolled prompt
        let phs = rolled.match(/\%(?:[a-zA-Z]+)(?:\/[a-zA-Z]+)*(?:\|[0-9]+-[0-9]+)?\%/g);
        // iterate
        if (!phs) return '';
        for (let z = 0; z < phs.length; z++) {
            let placeholder = phs[z];
            // split apart the name and the how-many
            let split = placeholder.substring(1, placeholder.length - 1).split('|');
            // from the name, split all possible GeneratorPlaceholders
            let ids = split[0].split('/');
            // create the list of GeneratorPlaceholders that actually are the objs instead of the strings
            let phList = [];
            for (let x = 0; x < ids.length; x++) {
                for (let c = 0; c < this.placeholders.length; c++) {
                    if (this.placeholders[c].id === ids[x]) {
                        phList.push(this.placeholders[c]);
                        break;
                    }
                }
            }
            // roll a how-many
            let count = split[1] ? this.randomInRange(split[1].split('-')[0], split[1].split('-')[1]) : 1;
            // roll results how-many times
            let results = [];
            for (let x = 0; x < count; x++)
                results.push(phList[this.randomInRange(0, phList.length - 1)].roll());
            // log this array inside the last rolled results array
            this.lastRolled.results.push({
                id: placeholder,
                results: results
            });
            // make the final string
            let string = '';
            for (let x = 0; x < results.length; x++)
                string += results[x] + (x === results.length - 1 ? '' : (x === results.length - 2 ? (results.length > 2 ? ', and ' : ' and ') : ', '));
            rolled = rolled.replace(phs[z], string).replace('  ', ' ').replace(' .', '.');
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
        this.replacements = new Gacha(replacements);
        this.allowRepeats = allowRepeats;
        this.alreadyRolled = [];
    }
    roll() {
        let rolled = this.replacements.roll();
        if (!this.allowRepeats) {
            while (this.alreadyRolled.includes(rolled)) {
                rolled = this.replacements.roll();
            }
            this.alreadyRolled.push(rolled);
            if (this.alreadyRolled.length == this.replacements.list.length) {
                this.clearAlreadyRolled();
            }
        }
        return rolled;
    }
    clearAlreadyRolled() {
        this.alreadyRolled = [];
    }
}

class Gacha {
    constructor(list) {
        let defaultCount = 0; // know how many prompts that have default possibility
        let definedWeight = 0; // count the weight already defined, so we can divide the rest by the defaultCount
        this.list = [];
        for (let z = 0; z < list.length; z++) {
            if (Array.isArray(list[z])) {
                definedWeight += list[z][1];
                this.list.push(list[z]);
            } else {
                defaultCount++;
                this.list.push([list[z]]);
            }
        }
        if (definedWeight > 1) throw new Error('probability cant be larger than 1');
        let leftoverProbability = (1 - definedWeight) / defaultCount;
        for (let z = 0; z < this.list.length; z++) {
            if (this.list[z].length === 1) this.list[z].push(leftoverProbability);
        }
    }
    roll() {
        let sum = 0, rand = Math.random();
        for (let z = 0; z < this.list.length; z++) {
            sum += this.list[z][1];
            if (rand <= sum) return this.list[z][0];
        }
    }
}
