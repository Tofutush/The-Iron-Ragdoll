// the generator that generates anything. needs to be used with the generator placeholder class

class Generator {
    constructor(placeholders, prompts) {
        this.placeholders = placeholders;
        this.prompts = prompts;
    }
    generate() {
        let rolled = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        let phs = rolled.match(/\%\w+\%/g);
        console.log(phs);

        for (let z = 0; z < phs.length; z++) {

        }
    }
}
