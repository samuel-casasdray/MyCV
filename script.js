
async function waitms(ms) {
    return new Promise(callback => {
        setTimeout(() => {
            callback("fini");
        }, ms);
    });
}

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

function changerdate(ancien, nouveau) {
    console.log(Object.keys(json_global["annee"]).reverse(), nouveau, ancien, child_tab, child_tab[nouveau.innerText]);
    ancien.classList.remove('select');
    nouveau.classList.add('select');
    document.getElementById("text-annee").innerHTML = "";
    document.getElementById("text-annee").appendChild(child_tab[nouveau.innerText]);
}

function loaddico(lang) {
    return new Promise(callback => {
        $.getJSON("dico/"+lang+".json", (json) => {
            if(lang !== "config")
                applydico(json);
            callback(json);
        });
    });
}

function applydico(json) {
    return new Promise(callback => {
        $('.dicojs').each((i, element) => {
            let value = json;
            for(let i of element.dataset.dico.split('-'))
                value = value[i];
            if(element.dataset.dico.startsWith("tab") && element.dataset.dico.startsWith("text")) {
                value = value.replace(/\n/g, '<br>');
            }
            if(element.dataset.dico.startsWith("try-app")) {
                let tab = value;
                value = "";
                for(let e of Object.keys(tab)) {
                    let balise = "<p><a class='try-item' href='"+tab[e]+"' target='_blank'>&nbsp;&nbsp;>>&nbsp;&nbsp;"+e+"</a></p>";
                    value += balise;
                }
            }
            element.innerHTML = value;
        });
        callback("fini");
    });
}

function applyconfig(json) {
    return new Promise(callback => {
        $(".configjs").each((i, element) => {
            if(element.dataset.config === "birth") {
                let birth = new Date(json["birth"]);
                let now = new Date(Date.now());
                let value = now.getFullYear() - birth.getFullYear() - 1;
                if(now.getMonth()>birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate()))
                    value++;
                element.innerHTML = value + "&nbsp;";
            }
        });
        callback();
    })
}

async function firstload() {
    json_config = await loaddico("config");
    const lang = navigator.language.slice(0, 2);
    $('.star').each((i, element) => {
        let cont = document.createElement("div");
        cont.classList.add("star-cont");
        for (let j = 0; j < 5; j++) {
            let span = document.createElement("span");
            span.classList.add("star-icon");
            if(element.dataset.star > j)
                span.classList.add("check");
            cont.appendChild(span);
        }
        element.appendChild(cont);
    });
    json_global = await loaddico(lang);
    $('#navbar').each((i,element) => {
        let nb = Object.keys(json_global["nav"]).length;
        for(let i = 1; i < nb+1; i++) {
            let ul = document.createElement("ul");
            ul.id = "nav-mc"+i;
            ul.onclick = () => {
                changerpage('mc'+i);
                if(window.outerWidth <= 768) {
                    document.getElementById("navburger").style.display = "block";
                    document.getElementById("menu").style.display = 'none';
                }
            };
            ul.dataset.dico = "nav-"+i;
            ul.classList.add("dicojs");
            if(i===1)
                ul.classList.add("active");
            document.getElementById("navbar").appendChild(ul);
        }
    });
    for(let i=1; i<Object.keys(json_global['tab']).length+1; i++) {
        let item = document.createElement("div");
        item.classList.add('tab-item');
        let titre = document.createElement('div');
        titre.classList.add('tab-titre');
        titre.classList.add('dicojs');
        titre.dataset.dico = 'tab-e'+i+'-titre';
        let text = document.createElement('div');
        text.classList.add("text-cont");
        let j = 0;
        for (let e of Object.keys(json_global['tab']['e'+i]['text'])) {
            j++;
            let p = document.createElement("div");
            if(Object.keys(json_global['tab']['e'+i]['text']).length === j)
                p.classList.add('last');
            p.classList.add('text');
            p.classList.add('dicojs');
            p.dataset.dico = "tab-e"+i+'-text-'+e;
            p.textContent = json_global['tab']['e'+i]['text'][e];
            text.appendChild(p);
        }
        let imgcont = document.createElement("div");
        imgcont.classList.add('image');
        imgcont.classList.add(json_global['tab']['e'+i]['image']['class']);
        for (let e of Object.keys(json_global['tab']['e'+i]['image']['list'])) {
            let img = document.createElement("img");
            img.src = json_global['tab']['e'+i]['image']['list'][e]["src"];
            img.alt = json_global['tab']['e'+i]['image']['list'][e]["alt"];
            imgcont.appendChild(img);
        }
        text.appendChild(imgcont);
        item.appendChild(titre);
        item.appendChild(text);
        document.getElementById('tab').appendChild(item);
    }
    await applydico(json_global);
    try {
        await loadannee(json_global);
    } catch (e) {
        console.error(e);
    }
    let list = [];
    $(".tab-item").each((i,element) => {
        list.push(element);
    });
    $(".tab-item").each((i,element) => {
        element.children[0].onclick = () => {
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
    document.getElementById("navburger-fa").onclick = () => {
        document.getElementById("navburger").style.display = "none";
        document.getElementById("menu").style.display = 'flex';
    };
    document.onclick = async (e) => {
        const temp = e.composedPath();
        if(!(temp.includes(document.getElementById('navburger-fa')) || temp.includes(document.getElementById("menu"))) && window.outerWidth <= 768) {
            document.getElementById("navburger").style.display = "block";
            document.getElementById("menu").style.display = 'none';
        }
    };
    document.getElementById("nightmode").onclick = () => setnight();
    const hours = new Date().getHours();
    if(hours > 6 && hours < 20) {
        document.getElementById("day").classList.remove("hide");
        document.getElementById("night").classList.add("hide");
    }
    else {
        setnight();
        document.getElementById("day").classList.add("hide");
        document.getElementById("night").classList.remove("hide");
    }
    $('#headerVideoLink').magnificPopup({
        type:'inline',
        midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
    });
    showflag(lang);
    await applyconfig(json_config);
}

function loadannee(json) {
    return new Promise(callback => {
        $('.text-cont-4').each((i, element) => {
            let nb = Object.keys(json["annee"]).reverse();
            let children = element.children;
            let childselect = null;
            if (children[0].innerHTML !== "")
                childselect = children[0].getElementsByClassName("select")[0].textContent;
            children[0].innerHTML = "";
            for (let a of nb) {
                let annee = document.createElement("div");
                let annee_text = document.createElement("div");
                for (let k of Object.keys(json["annee"][a])) {
                    let cont = document.createElement("div");
                    let titre = document.createElement("div");
                    let text = document.createElement("div");
                    cont.classList.add("annee-item-item");
                    titre.classList.add("annee-item-titre");
                    text.classList.add("annee-item-text");
                    text.innerHTML = json["annee"][a][k];
                    titre.innerHTML = k;
                    cont.appendChild(titre);
                    cont.appendChild(text);
                    annee_text.appendChild(cont);
                }
                annee.innerHTML = a;
                annee_text.id = "annee-text-id";
                annee_text.dataset.dico = a;
                annee_text.classList.add("annee-item");
                annee.onclick = () => changerdate(document.getElementsByClassName('select')[0], annee);
                children[0].appendChild(annee);
                children[1].appendChild(annee_text);
                child_tab[a] = annee_text;
            }
            let height = 0;
            for (let j of Object.values(child_tab))
                if (height < j.scrollHeight)
                    height = j.scrollHeight;
            let child_i = 0;
            if (childselect !== null) {
                for (let i = 0; i < element.children[0].children.length; i++) {
                    if (element.children[0].children[i].innerText === childselect) {
                        child_i = i;
                        break;
                    }
                }
            }
            element.children[0].children[child_i].classList.add('select');
            children[1].innerHTML = "";
            document.getElementById("text-annee").style.height = height + "px";
            children[1].appendChild(child_tab[element.children[0].children[0].textContent]);
        });
        callback("fin");
    });
}

function showflag(lang) {
    let language = document.getElementById('language');
    language.innerHTML = '';
    for(let flag of json_config["flag"]) {
        if(flag === lang)
            continue;
        let img = document.createElement("img");
        img.src = "ressources/Flag/" + flag + ".gif";
        img.classList.add("flag-item");
        img.id = flag;
        img.onclick = async () => {
            await loaddico(flag);
            showflag(flag);
        };
        language.appendChild(img);
    }
}

function setnight() {
    if(document.getElementById('day').classList.contains('hide')) {
        document.getElementById("day").classList.remove("hide");
        document.getElementById("night").classList.add("hide");
    }
    else {
        document.getElementById("day").classList.add("hide");
        document.getElementById("night").classList.remove("hide");
    }
    let listid_color = [["maincontent", "background", "mc1", "mc2", "mc3", "mc4", "navbar", "navburger-fa"]];
    let listid_bg = [["body", "menu"], ["background"]];
    for (let i = 0; i < listid_color.length; i++)
        for (let j = 0; j < listid_color[i].length; j++)
            document.getElementById(listid_color[i][j]).classList.toggle("black-color-" + i);
    for (let i = 0; i < listid_bg.length; i++)
        for (let j = 0; j < listid_bg[i].length; j++)
            document.getElementById(listid_bg[i][j]).classList.toggle("black-bg-" + i);
    document.getElementById("navbar").classList.toggle("black-color-1");
    document.getElementById("profil").classList.toggle("black-border");
    document.getElementById("list_competence").classList.toggle('black-bg-7');
    document.getElementById('headerVideoLink').classList.toggle('black-spe');
    $(".star-icon").each((i, element) => {
        if (!element.classList.contains('check'))
            element.classList.toggle("black-color-0");
    });
    $(".tab-item").each((i, element) => {
        element.classList.toggle("black-bg-2");
    });
    $(".tab-titre").each((i, element) => {
        element.classList.toggle("black-bg-3");
    });
    $(".text-cont").each((i, element) => {
        element.classList.toggle("black-bg-4");
    });
    $(".annee").each((i, element) => {
        element.classList.toggle("black-color-3");
    });
    $(".try-item").each((i, element) => {
        element.classList.toggle("black-color-2");
    });
}

let child_tab = {};
let json_global;
let json_config;