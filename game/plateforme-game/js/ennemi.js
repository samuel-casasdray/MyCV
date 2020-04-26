class Ennemi extends Entity{

    constructor(x, y, type) {
        super(x, y, type);
        this.dir = 'left';
    }

    iaForMove() {
        if(this.dir === 'right') {
            if(this.plateforme.isSolid(this.x + Game.pas / 2, this.y))
                this.dir = 'left';
            else
                this.x += Game.pas / 2;
        }
        if(this.dir === 'left') {
            if(this.plateforme.isSolid(this.x - Game.pas / 2, this.y))
                this.dir = 'right';
            else
                this.x -= Game.pas / 2;
        }
    }

    update() {
        this.iaForMove();
        super.update();
    }

}
