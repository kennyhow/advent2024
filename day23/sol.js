const fs = require('fs');
const print = console.log;

fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split('\n').map((line) => line.trim());
    
    let connected = new Map();
    data.forEach((line) => {
        let [a, b] = line.split('-');
        if (!connected.has(a)) {
            connected.set(a, new Set());
        }
        if (!connected.has(b)) {
            connected.set(b, new Set());
        }

        connected.get(a).add(b);
        connected.get(b).add(a);
    })

    let nodes = Array.from(connected.keys());
    let total = 0;

    let cliques = new Set();
    for(let i = 0; i < nodes.length; i++) {
        for(let j = 0; j < i; j++) {
            if (!connected.get(nodes[i]).has(nodes[j])) continue;
            for(let k = 0; k < j; k++) {
                if (!connected.get(nodes[i]).has(nodes[k])) continue;
                if (!connected.get(nodes[j]).has(nodes[k])) continue;
                cliques.add(new Set([nodes[i], nodes[j], nodes[k]]));

                if (nodes[i][0] === 't' || nodes[j][0] === 't' || nodes[k][0] === 't'){
                    total += 1;
                } 
            }
        }
    }
    print(`total is ${total}`)

    const isInClique = (clique, node) => {
        for(let nextNode of clique) {
            if (!connected.get(nextNode).has(node)) {
                return false;
            }
        }
        return true;
    }

    const pruneDuplicates = (set) => {
        let res = new Set();
        let visited = new Set();

        for(let clique of set) {
            let current = Array.from(clique).sort();
            if (visited.has(JSON.stringify(current))) continue;
            visited.add(JSON.stringify(current));

            res.add(new Set(clique));
        }
        return res;
    }

    while(cliques.size > 0) {
        let nextCliques = new Set();
        for(let clique of cliques) {
            for(let node of nodes) {
                if (clique.has(node)) continue;
                if (isInClique(clique, node)) {
                    let newClique = new Set(clique);
                    
                    newClique.add(node);
                    nextCliques.add(newClique);
                }
            }
        }
        cliques = pruneDuplicates(nextCliques);
        print(`cliques is ${JSON.stringify(Array.from(cliques).map((x) => Array.from(x)))}`)
        if (cliques.size > 0) {
            print(Array.from(Array.from(cliques)[0]).sort().join(','));
        }
    }
})