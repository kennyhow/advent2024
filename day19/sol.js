const fs = require('fs');
let print = console.log;

fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split('\n').map((line) => line.trim())
    let towels = data[0].split(', ');
    towels.sort((s, t) => {
        return s.length - t.length;
    })
    let targets = data.slice(2);
        
    const possible = (s) => {
        let res = Array.from({length: s.length + 1}, () => 0);
        res[0] = 1;
        for(let i = 0; i < res.length; i++) {
            let missingLength = s.length - i;
            if (res[i]) {
                for(let t of towels) {
                    if (t.length > missingLength) break;
                    if (t === s.slice(i, i + t.length)) {
                        res[i + t.length] += res[i];
                    }
                }
            }
        } 

        return res[s.length]
    }

    targets = targets.map(possible).reduce((acc, x) => acc + x, 0);
    print(targets);
})