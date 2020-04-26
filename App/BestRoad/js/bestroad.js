class Bestroad {

    constructor() {
        this.key = "AIzaSyBXa6aVzpxGVnFQ5ziMkrUBWjDzrKMXrko";
        this.list_address = [];
        this.list_time = [];
        this.depart = 0;
        this.arrive = 0;
        this.scenario();
    }

    scenario() {
        window.onerror = (msg, url, numligne) => {
            document.getElementById('error').innerText = msg + ' -> ' + url + ' -> ' + numligne;
        };
        document.getElementById('addAddressButtonFromMap').onclick = () => {
            let li = document.createElement("li");
            li.innerText = marker.getTitle();
            let input = document.createElement("input");
            input.type = "button";
            input.value = 'X';
            input.onclick = () => {
                this.list_address.splice(this.list_address.indexOf(marker.getTitle()), 1);
                document.getElementById('listAddress').removeChild(li);
            };
            li.appendChild(input);
            this.list_address.push(marker.getTitle());
            document.getElementById('listAddress').appendChild(li);

            let option = document.createElement("option");
            option.value = (this.list_address.length - 1) + "";
            option.appendChild(document.createTextNode(marker.getTitle()));
            document.getElementById('depart').appendChild(option);
            let option2 = document.createElement("option");
            option2.value = (this.list_address.length - 1) + "";
            option2.appendChild(document.createTextNode(marker.getTitle()));
            document.getElementById('arrive').appendChild(option2);
        };
        document.getElementById('calculate').onclick = () => {
            document.getElementById('chargement').innerText = 'CHARGEMENT....';
            this.calculate();
        };
        document.getElementById('depart').onchange = () => {
            this.depart = document.getElementById('depart').value;
        };
        document.getElementById('arrive').onchange = () => {
            this.arrive = document.getElementById('arrive').value;
        }
    }

    async toAddress(loc) {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+loc+"&key="+this.key;
        return new Promise(callback => {
            $.getJSON(url, {}).done(data => {
                let loc = data['results'][0]['formatted_address'];
                callback(loc);
            });
        });
    }

    async distanceMatrix(loc1, loc2) {
        return new Promise(callback => {
            service_distance.getDistanceMatrix({
                origins: [loc1],
                destinations: [loc2],
                travelMode: 'DRIVING',
            }, callback);
        });
    }

    async getAllDistance(locs) {
        return new Promise(async callback => {
            for (let i = 0; i < locs.length; i++) {
                for (let j = i+1; j < locs.length; j++) {
                    let data = await this.distanceMatrix(locs[i], locs[j]);
                    this.list_time.push([[locs[i], locs[j]], this.duration(data), this.distance(data)]);
                }
            }
            callback();
        });
    }

    duration(data) {
        return data['rows'][0]['elements'][0]['duration']['value'];
    }

    distance(data) {
        return data['rows'][0]['elements'][0]['distance']['value'];
    }

    remove(element, array) {
        let result = [];
        for(let e of array)
            if(e !== element)
                result.push(e);
        return result;
    }

    AllCombinations(locs) {
        let loc_depart = locs[this.depart];
        let loc_arrive = locs[this.arrive];
        console.log(locs);
        locs.splice(this.depart, 1);
        if(this.depart !== this.arrive)
            locs.splice(this.arrive - 1, 1);
        console.log(locs);
        let list = this.AllCombinationsAux(locs);
        let result = [];
        for(let l of list)
            result.push([loc_depart].concat(this.remove(undefined, l)).concat([loc_arrive]));
        console.log(result);
        return result;
    }

    AllCombinationsAux(locs) {
        if(!locs.length)
            return [undefined];
        let ac = [];
        for(let loc of locs) {
            let temp = this.remove(loc, locs);
            let recursive = this.AllCombinationsAux(temp);
            if(recursive.length)
                for(let r of recursive)
                    ac.push([loc].concat(r));
            else
                ac.push([recursive]);
        }
        return ac;
    }

    getindex(loc1, loc2) {
        let i = 0;
        for(let element of this.list_time) {
            if((element[0][0] === loc1 && element[0][1] === loc2) || (element[0][0] === loc2 && element[0][1] === loc1))
                return i;
            i++;
        }
    }

    async getMeilleur(locs) {
        let combis = this.AllCombinations(locs);
        let c;
        let min = Number.POSITIVE_INFINITY;
        let metre;
        for(let combi of combis) {
            let time = 0;
            let m = 0;
            for (let i = 0; i < combi.length - 1; i++) {
                let data = this.list_time[this.getindex(combi[i], combi[i+1])];
                time += data[1];
                m += data[2];
            }
            if(time < min) {
                min = time;
                c = combi;
                metre = m;
            }
        }
        return [c, min, metre];
    }

    async calculate() {
        let a = Array.from(this.list_address);
        await this.getAllDistance(a);
        let meilleur = await this.getMeilleur(a);
        this.affichage(meilleur);
    }

    convertSecond(sec) {
        let second = sec%60;
        sec -= second;
        sec /= 60;
        let minute = sec%60;
        sec -= minute;
        sec /= 60;
        let heure = sec;
        return heure + "h, " + minute + "min, " + second + "sec";
    }

    affichage(meilleur) {
        let resultat = document.getElementById('resultat');
        resultat.innerHTML = "";
        let ol = document.createElement("ol");
        let text = "";
        for(let str of meilleur[0]) {
            let li = document.createElement("li");
            li.innerText = str;
            ol.appendChild(li);
            text += str + "/";
        }
        resultat.appendChild(ol);
        let span = document.createElement("span");
        span.innerText = this.convertSecond(meilleur[1]);
        resultat.appendChild(span);
        let span2 = document.createElement("span");
        span2.innerText = "  -> " + (meilleur[2] / 1000).toString() + "km";
        resultat.appendChild(span2);
        resultat.appendChild(document.createElement("br"));
        let a = document.createElement("a");
        a.href = 'https://www.google.fr/maps/dir/'+text.replace(/\s/g, '+');
        a.text = "Voir sur Google Maps";
        a.target = '_blank';
        resultat.appendChild(a);
        document.getElementById('chargement').innerHTML = '';
    }

}
