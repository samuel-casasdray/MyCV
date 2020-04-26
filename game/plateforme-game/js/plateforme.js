class Plateforme {

    constructor(level, player) {
        this.camera = 0;
        this.mapBloc = new Map();
        this.typeBloc = new Map();
        this.typeMonstre = new Map();
        this.monstre = [];
        this.block = [];
        this.initiateBlock();
        this.player = player;
        this.level = level;
        for (let i = 0; i < this.level.length; i++) {
            let row = [];
            for (let j = 0; j < this.level[i].length; j++) {
                if(this.mapBloc.has(this.level[i][j]))
                    row.push(new Bloc(this.mapBloc.get(this.level[i][j]), j, i));
                else
                    row.push(new Bloc(this.mapBloc.get("0"), j, i));
                if(this.typeMonstre.has(this.level[i][j])) {
                    console.log(j, i);
                    this.monstre.push(new Ennemi(j, i, this.typeMonstre.get(this.level[i][j])));
                }
            }
            this.block.push(row);
        }
        for(let i = 0; i < this.block.length; i++) {
            for(let j = 0; j < this.block[i].length; j++) {
                this.block[i][j].addToGame();
            }
        }
        for(let m of this.monstre) {
            m.update();
            Game.game.appendChild(m.show());
        }
    }

    moveCamera(dir) {
        let posdiv = this.player.getPosition()[0] - this.camera;
        if(dir === 'left' && posdiv < 5 && this.camera >= Game.pas) {
            this.camera -= Game.pas;
        }
        if(dir === 'right' && posdiv > 10 && this.camera <= 185 - Game.pas) { // 185 = 200 (niveau) - 15 (div)
            this.camera += Game.pas
        }
    }

    updateCamera() {
        Game.game.style.left = '-'+(this.camera * 32)+'px';
    }

    initiateBlock() {
        this.mapBloc.set("0", "air.png");
        this.mapBloc.set("1", "sol.png");
        this.typeBloc.set("solid", ["1"]);
        this.typeBloc.set("air", ["0", "A"]);
        this.typeMonstre.set("A", "monstre_1");
    }

    findSomething(what) {
        for (let i = 0; i < this.level.length; i++)
            for (let j = 0; j < this.level[i].length; j++)
                if(this.level[i][j] === what)
                    return [j, i];
        return -1;
    }

    locOfPlayer() {
        let loc = this.findSomething("6");
        if(loc === -1)
            loc = [1, 6];
        return loc;
    }

    isSolid(x, y) {
        return this.typeBloc.get("solid").includes(this.level[Math.ceil(y)][Math.floor(x)]) ||
            this.typeBloc.get("solid").includes(this.level[Math.ceil(y)][Math.ceil(x)]);
    }

    createMonstre() {

    }

}
