
function cacher(im) {
    im.classList.remove("visible");
    im.classList.add("cache");
}

function afficher(im) {
    im.classList.add("visible");
    im.classList.remove("cache");
}

function navchange(ancien, nouveau) {
    ancien.classList.remove("active");
    nouveau.classList.add("active");
}

function changerpage(id) {
    cacher(document.getElementsByClassName("visible")[0]);
    afficher(document.getElementById(id));
    navchange(document.getElementsByClassName("active")[0], document.getElementById("nav-"+id))
}

function loaddico(lang) {
    console.log("load");
    $.getJSON("dico/"+lang+".json", (json) => {
        applydico(json);
    });
}

function applydico(json) {
    console.log("apply");
    $('.dicojs').each((i, element) => {
        element.innerText = json[element.dataset.dico];
    })
}

loaddico("fr");