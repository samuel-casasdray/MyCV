class Bestroad {

    constructor() {
        this.key = "AIzaSyBXa6aVzpxGVnFQ5ziMkrUBWjDzrKMXrko";
        this.list_address = [];
        this.scenario();
    }

    scenario() {
        document.getElementById('addAddressButton').onclick = () => {
            let li = document.createElement("li");
            let address = document.getElementById('addAddress').value;
            li.innerText = address;
            let input = document.createElement("input");
            input.type = "button";
            input.value = 'X';
            li.appendChild(input);
            this.list_address.push(address);
            document.getElementById('listAddress').appendChild(li);
        };
        document.getElementById('addAddressButtonFromMap').onclick = () => {
            let li = document.createElement("li");
            let input = document.createElement("input");
            input.type = "button";
            input.value = 'X';
            li.appendChild(input);
            li.innerText = marker.getTitle();
            this.list_address.push(marker.getTitle());
            document.getElementById('listAddress').appendChild(li);
        }
        document.getElementById('calculate').onclick = () => this.calculate();
    }

    async toCoord(loc) {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+loc.replace(' ', '+')+"&key="+this.key;
        return new Promise(callback => {
            $.getJSON(url, {}).done(data => {
                let loc = data['results'][0]['geometry']['location'];
                callback(loc['lat'] + ',' + loc['lng']);
            });
        });
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
        let url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+loc1+"&destinations="+loc2+"&key="+this.key;
        return new Promise(callback => {
            $.getJSON(url, {}).done(data => {
                callback(data);
            });
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
        let loc = locs[0];
        locs = locs.splice(1);
        let list = this.AllCombinationsAux(locs);
        let result = [];
        for(let l of list)
            result.push([loc].concat(this.remove(undefined, l)));
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

    async getMeilleur(locs) {
        let combis = this.AllCombinations(locs);
        let c;
        let min = Number.POSITIVE_INFINITY;
        let metre;
        for(let combi of combis) {
            let time = 0;
            let m = 0;
            for (let i = 0; i < combi.length - 1; i++) {
                let data = await this.distanceMatrix(combi[i], combi[i+1]);
                time += this.duration(data);
                m += this.distance(data);
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
        let locs = [];
        for(let address of this.list_address)
            locs.push(await this.toCoord(address));
        let meilleur = await this.getMeilleur(locs);
        for (let i = 0; i < meilleur[0].length; i++) {
            let add = await this.toAddress(meilleur[0][i]);
            meilleur[0][i] = [meilleur[0][i], add];
        }
        console.log(meilleur[0], this.convertSecond(meilleur[1]), meilleur[2]);
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

}