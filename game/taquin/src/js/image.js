class Image {

    constructor(nb, theme) {
        this.nb = nb;
        this.src = 'img/'+theme+'/'+theme+'_'+nb+'.jpg';
    }

    changerTheme(theme) {
        this.src = 'img/'+theme+'/'+theme+'_'+this.nb+'.jpg';
    }

    getImage() {
        return this.src;
    }

    estVide() {
        return this.nb === 15;
    }

}