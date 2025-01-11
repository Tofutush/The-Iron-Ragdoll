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

class GeneratorPlaceholderPresets {
    static nounWithArticle = new GeneratorPlaceholder('nounWithArticle', [
        'a sandwich',
    ]);
}
