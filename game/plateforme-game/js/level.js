class Level {

    constructor(nom) {
        this.nom = nom;
    }

    loadFile() {
        return new Promise(callback => {
            fetch("level/" + this.nom)
                .then(response => response.text())
                .then(data => callback(data));
        });
    }

    async loadLevel() {
        let level = await this.loadFile();
        level = level.split('\n');
        for (let i = 0; i < 8; i++) {
            level[i] = level[i].split("");
            while(level[i].length > 200)
                level[i].pop()
        }
        while(level.length > 8)
            level.pop();
        return level;
    }

}
