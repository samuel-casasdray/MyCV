class Sokoban_ed {

    constructor() {
        this.list_image = ["brique.png", "caisse.png", "drapeau.png", "joueur.gif", "vide.png"];
        for(let img of this.list_image) {
            let i = document.createElement("img");
            i.src = "images/"+img;
            i.onclick = () => this.selectimg(this.list_image.indexOf(img));
            document.getElementById("case").appendChild(i);
        }
        this.level = [];
        for (let i = 0; i < 20; i++) {
            let row = [];
            for (let j = 0; j < 20; j++) {
                row.push(0);
            }
            this.level.push(row);
        }
        document.getElementById('export').onclick = () => this.export();
        this.afficher();
    }

    selectimg(nb) {
        this.selecti = nb;
    }

    clickon(row, col) {
        this.level[row][col] = this.selecti;
        this.afficher();
    }

    afficher() {
        document.getElementById("grille").innerHTML = "";
        for (let i = 0; i < 20; i++) {
            let div = document.createElement("div");
            for (let j = 0; j < 20; j++) {
                let img = document.createElement("img");
                img.src = "images/"+this.list_image[this.level[i][j]];
                img.onclick = () => this.clickon(i, j);
                div.appendChild(img);
            }
            document.getElementById("grille").appendChild(div);
        }
    }

    export() {
        let a = document.createElement("a");
        const json = JSON.stringify(this.level),
            blob = new Blob([json], {type: "text/plain;charset=utf-8"});
        a.href = window.URL.createObjectURL(blob);
        a.download = 'lvl.json';

        // a.setAttribute('href', 'data:text/json;charset:utf-8,' + JSON.stringify(this.level));
        // a.setAttribute('download', 'lvl.json');
        a.click();
    }

}