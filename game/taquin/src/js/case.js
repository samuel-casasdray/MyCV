class Case {

    constructor(ligne, colonne, theme, nbimage) {
        this.image = new Image(nbimage, theme);
        this.id = 'photo'+nbimage;
        this.colonne = colonne;
        this.ligne = ligne;
        this.voisins = [];
        if(ligne > 0) this.voisins.push([ligne-1, colonne]);
        if(ligne < 3) this.voisins.push([ligne+1, colonne]);
        if(colonne > 0) this.voisins.push([ligne, colonne-1]);
        if(colonne < 3) this.voisins.push([ligne, colonne+1]);
    }

    estUnVoisin(c) {
        for(let voisin of this.voisins)
            if(c.ligne === voisin[0] && c.colonne === voisin[1])
                return true;
        return false;
    }

    estVide() {
        return this.image.estVide();
    }

    changerTheme(theme) {
        this.image.changerTheme(theme);
        this.actualiserAffichage();
    }

    permuterCase(c) {
        if(this.estUnVoisin(c)) {
            let img = this.image;
            this.image = c.image;
            c.image = img;
            this.actualiserAffichage();
            c.actualiserAffichage();
            return 1;
        }
        return 0;
    }

    actualiserAffichage() {
        document.getElementById(this.id).src = this.image.getImage();
    }

}