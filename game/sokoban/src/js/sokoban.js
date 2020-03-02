
class Sokoban {

    constructor() {
        this.loadall(1).then(r => {});
        this.list = [new Elem('brique.png'), new Elem('caisse.png'), new Elem('drapeau.png'), new Elem('joueur.gif'), new Elem(null)];
    }

    async loadall(nb) {
        let niveau = await this.chargerNiveau('level/lvl'+nb+'.json');
        this.cases = [];
        let l = 0;
        for(let ligne in niveau) {
            let c = 0;
            let row = [];
            for(let col of niveau[ligne]) {
                row.push([new Case(c, l, this.list[col])]);
                if(col === "3") this.persoco = [c, l];
                c++;
            }
            this.cases.push(row);
            l++;
        }
        this.affichage();
        console.log(this.persoco);
        document.addEventListener("keydown", this.deplacement, true);
        document.getElementById("recommencer").onclick = () => this.loadall(nb);
        document.getElementById("autre_niveau").onclick = () => this.autre_niveau();
    }

    chargerNiveau(src) {
        return new Promise(callback => {
            $.getJSON(src, (lvl) => {
                callback(lvl);
            });
        });
    }

    affichage() {
        let text = '<img src="images/fond.png">';
        text += '<div class="cont">';
        for (let i = 0; i < this.cases.length; i++) {
            text += '<div class="row">';
            for (let j = 0; j < this.cases[i].length; j++) {
                text += this.cases[i][j][this.cases[i][j].length - 1].affichage();
            }
            text += '</div>';
        }
        text += '</div>';
        document.getElementById('grille').innerHTML = text;
    }

    ajouterCase(x, y, xb, yb) {
        if(this.cases[yb][xb][0].estVide())
            this.cases[yb][xb].pop();
        this.cases[yb][xb].push(this.cases[y][x][this.cases[y][x].length - 1]);
        this.cases[y][x].pop();
        if(this.cases[y][x].length === 0)
            this.cases[y][x] = [new Case(x, y, this.list[4])];
    }

    deplacement(k) {
        k = k.key;
        if(!k.startsWith('Arrow'))
            return;
        let x = sokoban.persoco[0];
        let y = sokoban.persoco[1];
        let xb = sokoban.persoco[0];
        let yb = sokoban.persoco[1];
        if(k.endsWith('Up')) {
            y--;
            yb-=2;
        }
        else if(k.endsWith('Down')) {
            y++;
            yb+=2
        }
        else if(k.endsWith('Right')) {
            x++;
            xb+=2;
        }
        else if(k.endsWith('Left')) {
            x--;
            xb-=2;
        }
        let c = sokoban.cases[y][x][sokoban.cases[y][x].length - 1];
        let cb = sokoban.cases[yb][xb][sokoban.cases[yb][xb].length - 1];
        if(c.element.typec === 'caisse') {
            if(cb.element.typec !== 'brique') {
                sokoban.ajouterCase(x, y, xb, yb);
            }
        }
        if(c.element.typec !== 'brique' && !(c.element.typec === 'caisse' && cb.element.typec === 'brique')) {
            sokoban.ajouterCase(sokoban.persoco[0], sokoban.persoco[1], x, y);
            sokoban.persoco = [x, y];
        }
        sokoban.affichage();
        sokoban.fini();
    }

    fini() {
        for(let row of this.cases)
            for (let col of row)
                if (col[0].estUneCaisse())
                    return false;
        document.removeEventListener("keydown", this.deplacement, true);
        return true;
    }

    autre_niveau() {
        let nb = Math.floor(Math.random() * 2) + 1;
        console.log(nb);
        this.loadall(nb).then(r => {});
    }

}