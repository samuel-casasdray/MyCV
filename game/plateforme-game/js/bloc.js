class Bloc {

    constructor(nom, x, y) {
        this.src = 'img/'+nom;
        this.block = document.createElement("img");
        this.block.src = this.src;
        this.block.style.left = (x * 32) + "px";
        this.block.style.top = (y * 32) + "px";
    }

    addToGame(){
        Game.game.appendChild(this.block);
    }

}
