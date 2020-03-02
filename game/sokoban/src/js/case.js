class Case {

    constructor(x, y, elem) {
        this.element = elem;
        this.x = x;
        this.y = y;
    }

    affichage() {
        return this.element.affichage();
    }

    estVide() {
        return this.element.typec === null;
    }

    estUneCaisse() {
        return this.element.typec === 'caisse';
    }

}