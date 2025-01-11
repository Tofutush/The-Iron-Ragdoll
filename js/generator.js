// the generator that generates anything. needs to be used with the generator placeholder class

class Generator {
    constructor(placeholders, prompts) {
        this.placeholders = placeholders;
        this.prompts = prompts;
    }
    generate() {
        let rolled = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        let phs = rolled.match(/\%\w+\%/g);
        for (let z = 0; z < phs.length; z++) {
            let id = phs[z].substring(1, phs[z].length - 1);
            for (let x = 0; x < this.placeholders.length; x++) {
                if (this.placeholders[x].id === id) {
                    rolled = rolled.replace(phs[z], this.placeholders[x].roll());
                    break;
                }
            }
        }
        return rolled;
    }
}
