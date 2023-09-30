export class AlgCard {
    constructor(name, alg, note, tags) {
        this.name = name;
        this.alg = alg;
        this.note = note == undefined ? "" : note;
        this.scramble = ""
        this.tags = tags;
    }
}