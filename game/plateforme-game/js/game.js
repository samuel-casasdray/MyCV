class Game {

    static game = document.getElementById("game");
    static pas = 0.1;

    constructor() {
        this.start();
        this.onGame = true;
    }

    async start() {
        this.level = new Level("lvl1");
        this.player = new Player(5, 1);
        this.map = new Plateforme(await this.level.loadLevel(), this.player);
        this.player.setPlateforme(this.map);
        let loc = this.map.locOfPlayer();
        this.player.moveTo(loc[0], loc[1]);
        this.active = true;
        Game.game.appendChild(this.player.show());
        this.gameloop();
        window.addEventListener("mousedown", (ev) => this.toggleGameLoop(ev))
    }

    toggleGameLoop(ev) {
        if(ev.button === 1)
            this.onGame = !this.onGame;
    }

    gameloop() {
        if(!this.onGame) {
            setTimeout(() => window.requestAnimationFrame(() => this.gameloop()), 10);
            return;
        }
        this.player.move();
        this.player.update();
        this.map.updateCamera();
        this.map.updateMonstre();
        setTimeout(() => window.requestAnimationFrame(() => this.gameloop()), 10);
    }

}
