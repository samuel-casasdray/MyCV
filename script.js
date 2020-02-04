
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

function firstload() {
    $('.star').each((i, element) => {
        console.log(element);
        for (let j = 0; j < 5; j++) {
            let td = document.createElement("td");
            td.classList.add("star-icon");
            if(element.dataset.star > j)
                td.classList.add("check");
            element.appendChild(td);
        }
    })
}

loaddico("fr");