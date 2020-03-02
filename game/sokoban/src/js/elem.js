class Elem {

    constructor(src) {
        if(src !== null) {
            this.src = 'images/' + src;
            this.typec = src.substr(0, src.length-4);
        }
        else {
            this.src = src;
            this.typec = null;
        }
    }

    affichage() {
        if(this.src === null)
            return '<div class="img_vide"></div>';
        return '<img src="' + this.src + '" alt="img">';
    }

}

