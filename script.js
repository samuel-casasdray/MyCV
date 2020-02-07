
function waitms(ms) {
    return new Promise(callback => {
        setTimeout(() => {
            callback("fini");
        }, ms);
    });
}

async function cacher(im) {
    im.classList.remove("visible");
    im.classList.add("cache");
}

async function afficher(im) {
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

function changerdate(ancien, nouveau) {
    console.log(Object.keys(json_global["annee"]).reverse(), nouveau, ancien);
    let i_a = Object.keys(json_global["annee"]).reverse().indexOf(ancien.innerText);
    let i_n = Object.keys(json_global["annee"]).reverse().indexOf(nouveau.innerText);
    ancien.classList.remove('select');
    nouveau.classList.add('select');
    document.getElementById(ancien.innerText).classList.add('hide');
    document.getElementById(nouveau.innerText).classList.remove('hide');
}

function loaddico(lang) {
    return new Promise(callback => {
        $.getJSON("dico/"+lang+".json", (json) => {
            applydico(json);
            callback(json);
        });
    });
}

function applydico(json) {
    return new Promise(callback => {
        $('.dicojs').each((i, element) => {
            let text = json[element.dataset.dico];
            if(element.dataset.dico.startsWith("tab-text"))
                text = "<div>" + text.replace(/\n/g, "</div><div>") + "</div>";
            element.innerHTML = text;
        });
        callback("fini");
    });
}

async function firstload() {
    $('.star').each((i, element) => {
        for (let j = 0; j < 5; j++) {
            let td = document.createElement("td");
            td.classList.add("star-icon");
            if(element.dataset.star > j)
                td.classList.add("check");
            element.appendChild(td);
        }
    });
    json_global = await loaddico("fr");
    $('#navbar').each((i,element) => {
        let nb = countkeys(json_global, "nav");
        console.log(nb);
        for(let i = 1; i < nb+1; i++) {
            let ul = document.createElement("ul");
            ul.id = "nav-mc"+i;
            ul.onclick = () => changerpage('mc'+i);
            ul.dataset.dico = "nav-"+i;
            ul.classList.add("dicojs");
            if(i===1)
                ul.classList.add("active");
            document.getElementById("navbar").appendChild(ul);
        }
    });
    await applydico(json_global);
    let list = [];
    $(".tab-item").each((i,element) => {
        list.push(element);
    });
    $(".tab-item").each((i,element) => {
        element.onclick = () => {
            let content = element.children[1];
            content.classList.toggle("active");
            for(let elementbis of list) {
                if(elementbis !== element)
                    elementbis.children[1].style.maxHeight = null;
            }
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            } };
    });
    $('.text-cont-4').each((i,element) => {
        let nb = Object.keys(json_global["annee"]).reverse();
        let children = element.children;
        for (let a of nb) {
            let annee = document.createElement("div");
            let annee_text = document.createElement("div");
            for (let k of Object.keys(json_global["annee"][a])) {
                let cont = document.createElement("div");
                let titre = document.createElement("div");
                let text = document.createElement("div");
                cont.classList.add("annee-item-item");
                titre.classList.add("annee-item-titre");
                text.classList.add("annee-item-text");
                text.innerHTML = json_global["annee"][a][k];
                titre.innerHTML = k;
                cont.appendChild(titre);
                cont.appendChild(text);
                annee_text.appendChild(cont);
            }
            annee.innerHTML = a;
            annee_text.id = a;
            annee_text.classList.add("annee-item");
            annee_text.classList.add("hide");
            annee.onclick = () => changerdate(document.getElementsByClassName('select')[0], annee);
            children[0].appendChild(annee);
            children[1].appendChild(annee_text);
        }
        console.log(element.children);
        element.children[0].children[0].classList.add('select');
        element.children[1].children[0].classList.remove('hide');
    });
    changerpage("mc4");
}

function countkeys(liste, vari) {
    let i = 0;
    for(let key of Object.keys(liste)) {
        if(key.toString().startsWith(vari))
            i++;
    }
    return i;
}

let json_global;