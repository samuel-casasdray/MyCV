
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
            element.innerText = json[element.dataset.dico];
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
    const json_global = await loaddico("fr");
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
    console.log(list);
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
    changerpage("mc3");
}

function countkeys(liste, vari) {
    let i = 0;
    for(let key of Object.keys(liste)) {
        if(key.toString().startsWith(vari))
            i++;
    }
    return i;
}