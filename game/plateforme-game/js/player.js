class Player extends Entity {


    constructor(x, y) {
        super(x, y, 'player');
        this.left = false;
        this.right = false;
        this.space = false;
        this.spacing = false;
        this.isFalling = false;
        this.temp_y = 0;
        window.onkeydown = (ev) => this.toggleKey("press", ev);
        window.onkeyup = (ev) => this.toggleKey("up", ev);
    }

    toggleKey(type, ev) {
        let key = ev.key;
        switch (key) {
            case "ArrowUp":
                if((this.space === true && !this.isOnBlock(Game.pas)) || (this.space === false && type === "press" && this.isOnBlock(Game.pas)))
                    this.space = !this.space;
                break;
            case "ArrowLeft":
                if((this.left === true && type === "up") || (this.left === false && type === "press"))
                    this.left = !this.left;
                break;
            case "ArrowRight":
                if((this.right === true && type === "up") || (this.right === false && type === "press"))
                    this.right = !this.right;
                break;
        }
    }

    move() {
        if(this.left) {
            if (this.x - Game.pas > 0 && !this.collide(this.x - Game.pas, this.y)) {
                this.plateforme.moveCamera('left');
                this.x -= Game.pas;
            }
        }
        if(this.right) {
            if (this.x + Game.pas < 199 && !this.collide(this.x + Game.pas, this.y)) {
                this.plateforme.moveCamera('right');
                this.x += Game.pas;
            }
        }
        if(this.space && !this.spacing) {
            this.space = false;
            this.spacing = true;
            this.doSpace(0);
        }
        if((this.right || this.left) && !this.isOnBlock(Game.pas) && !this.spacing && !this.isFalling) {
            this.isFalling = true;
            this.fall(0);
        }
    }

    fall(i) {
        if(i === 0)
            this.temp_y = this.y;
        let fx = this.temp_y + "- (((- ((x) ** 3)) + 3.5 * (x))/3)";
        let fx_replace = fx.replace(/x/g, ((i+188)/100).toString());
        let y = eval(fx_replace);
        if(this.isBlockHere(this.x, y)) {
            this.isFalling = false;
            return;
        }
        this.y = y;
        setTimeout(() => this.fall(i + 1), 1);
    }

    doSpace(iteration) {
        if(iteration === 0)
            this.temp_y = this.y;
        let fx = this.temp_y + "- ((- ((x) ** 3)) + 3.5 * (x))";
        let fx_replace = fx.replace(/x/g, (iteration/100).toString());
        let y = eval(fx_replace);
        if(this.isBlockHere(this.x, y) || this.isBlockHere(this.x, y-1)) {
            if(iteration <= 108) {
                let c = true;
                let i = iteration + 1;
                while(c) {
                    let fx = this.temp_y + "- ((- ((x) ** 3)) + 3.5 * (x))";
                    let fx_replace = fx.replace(/x/g, (i/100).toString());
                    let yb = eval(fx_replace);
                    if(yb >= y) {
                        this.y = yb;
                        c = false;
                    }
                    i++;
                }
                this.doSpace(i);
            }
            else {
                this.y = Math.floor(y);
                this.spacing = false;
                this.update();
            }
            return;
        }
        this.y = y;
        this.update();
        setTimeout(() => this.doSpace(iteration+1), 1);
    }

    isOnBlock(yspan) {
        return this.plateforme.isSolid(this.x, this.y + yspan);
    }

    isBellowBlock(yspan) {
        return this.plateforme.isSolid(this.x, this.y - yspan);
    }

    isBlockHere(x, y) {
        return this.plateforme.isSolid(x, y);
    }

    collide(x, y) {
        return this.isBlockHere(x, y) || this.isBlockHere(x, y-1);
    }

    getPosition() {
        return [this.x, this.y];
    }

}
