class Taquin {

    constructor() {
        this.coups = 0;
        this.cases = [];
        this.theme = 'nombres';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++)
                this.cases.push(new Case(i, j, this.theme, i * 4 + j));
        }
        this.cases.push(new Case(100, 100, this.theme, 16));
        for(let c of this.cases)
            c.actualiserAffichage();
        for(let c of this.cases)
            document.getElementById(c.id).onclick = () => {
                let cv = this.laCaseVide();
                this.coups += c.permuterCase(cv);
                this.afficher();
                this.victoire();
            };
        document.getElementById('melanger').onclick = () => this.melanger();
        document.getElementById('solution').onclick = () => this.solution();
        document.getElementById('themes').onchange = () => this.changerTheme(document.getElementById('themes').value);
    }

    laCaseVide() {
        for(let c of this.cases)
            if(c.estVide())
                return c;
    }

    melanger() {
        for (let i = 0; i < 500; i++) {
            this.cases[Math.floor(Math.random() * this.cases.length)].permuterCase(this.laCaseVide());
        }
        this.afficher();
    }

    solution() {
        if(document.getElementById('solution').value === 'solution') {
            document.getElementById('jeu').style.display = 'none';
            document.getElementById('modele').style.display = 'flex';
            document.getElementById('solution').value = 'puzzle';
        }
        else {
            document.getElementById('jeu').style.display = 'flex';
            document.getElementById('modele').style.display = 'none';
            document.getElementById('solution').value = 'solution';
        }
    }

    countBienPlace() {
        let nb = 0;
        for (let i = 0; i < 16; i++)
            if(this.cases[i].image.nb === i)
               nb++;
        return nb;
    }

    afficher(text) {
        let t;
        if(text !== undefined)
            t = text;
        else
            t = this.coups + ' coup, ' + this.countBienPlace() +  ' bien placés';
        document.getElementById('message').innerText = t;
    }

    changerTheme(theme) {
        this.theme = theme;
        for (let c of this.cases)
            c.changerTheme(theme);
    }

    victoire() {
        if(this.countBienPlace() === 16) {
            this.afficher('bravo, puzzle résolu en ' + this.coups + ' coups.');
            let c = this.laCaseVide();
            c.image.src = 'img/'+this.theme+'/'+this.theme+'_.jpg';
            c.image.nb = '';
            c.actualiserAffichage();
            for(let c of this.cases)
                document.getElementById(c.id).onclick = null;
        }
    }

}