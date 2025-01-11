class GeneratorPlaceholder {
    constructor({ id, replacements, allowRepeats = true, transform }) {
        this.id = id;
        this.replacements = replacements;
        this.allowRepeats = allowRepeats;
        this.alreadyRolled = [];
        if (transform) {
            this.replacements.forEach(transform);
        }
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
