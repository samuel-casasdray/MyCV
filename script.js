
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
            json_global = json;
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
            if(element.dataset.dico.startsWith("tab-text"))
                value = "<div>" + text.replace(/\n/g, "</div><div>") + "</div>";
            element.innerHTML = value;
        });
        try {
            loadannee();
        } catch (e) {
            console.error(e);
        }
        /*try {
            for(let child1 of Object.entries(child_tab)) {
                for(let child2 of Object.entries(child1[1].children)) {
                    child2[1].children[0].textContent = Object.entries(json_global["annee"]["2018"])[child2[0]][0];
                    child2[1].children[1].textContent = Object.entries(json_global["annee"]["2018"])[child2[0]][1];

                }
            }
        } catch (e) {
            console.error(e);
        }*/
        callback("fini");
    });
}

async function firstload() {
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
    json_global = await loaddico("fr");
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
    await applydico(json_global);
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
    document.getElementById("config-button").onclick = () => {
        document.getElementById("config-menu").classList.add("show");
        console.log(window.innerWidth)
        if (window.innerWidth <= 768)
            document.getElementById("config-menu").style.width = "45%";
        else
            document.getElementById("config-menu").style.width = "20%";
    };
    document.getElementById("navburger-fa").onclick = () => {
        document.getElementById("navburger").style.display = "none";
        document.getElementById("menu").style.display = 'flex';
    };
    document.onclick = async (e) => {
        var temp = e.composedPath();
        if(!(temp.includes(document.getElementById("config-menu")) || temp.includes(document.getElementById("config-button")))) {
            document.getElementById("config-menu").style.width = "0";
            await waitms(200);
            document.getElementById("config-menu").classList.remove("show");
        }
        if(!(temp.includes(document.getElementById('navburger-fa')) || temp.includes(document.getElementById("menu"))) && window.outerWidth <= 768) {
            document.getElementById("navburger").style.display = "block";
            document.getElementById("menu").style.display = 'none';
        }
    };
    for(let flag of json_global["flag"]) {
        let img = document.createElement("img");
        img.src = "ressources/Flag/" + flag + ".gif";
        img.classList.add("flag-item");
        img.id = flag;
        img.onclick = async () => {
            await loaddico(flag);
            document.getElementById("config-menu").style.width = "0";
            await waitms(200);
            document.getElementById("config-menu").classList.remove("show");
        };
        document.getElementById("lang").appendChild(img);
    }
    document.getElementById("darkmode-button").onclick = async () => {
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
        document.getElementById("slider").classList.toggle("black-bg-5");
        document.getElementById("config-menu").classList.toggle("black-bg-6");
        document.getElementById("config-menu").classList.toggle("black-color-0");
        document.getElementById("config-menu").style.width = "0";
        await waitms(200);
        document.getElementById("config-menu").classList.remove("show");
    };
    changerpage("mc3");
}

function loadannee() {
    $('.text-cont-4').each((i,element) => {
        let nb = Object.keys(json_global["annee"]).reverse();
        let children = element.children;
        let childselect = null;
        if(children[0].innerHTML !== "")
            childselect = children[0].getElementsByClassName("select")[0].textContent;
        children[0].innerHTML = "";
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
            annee_text.id = "annee-text-id";
            annee_text.dataset.dico = a;
            annee_text.classList.add("annee-item");
            annee.onclick = () => changerdate(document.getElementsByClassName('select')[0], annee);
            children[0].appendChild(annee);
            children[1].appendChild(annee_text);
            child_tab[a] = annee_text;
        }
        let height = 0;
        for(let j of Object.values(child_tab))
            if(height < j.scrollHeight)
                height = j.scrollHeight;
        let child_i = 0;
        if (childselect !== null) {
            for(let i=0; i<element.children[0].children.length; i++) {
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
}

let child_tab = {};
let json_global;