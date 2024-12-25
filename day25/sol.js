const fs = require('fs');
let print = console.log;

class Lock {
    constructor(arr) {
        this.arr = arr.slice();
    }

    fitsWith(key) {
        // print(`checking ${this.arr} against ${key.arr}`)
        for(let i = 0; i < 5; i++) {
            if (this.arr[i] + key.arr[i] > 7) {
                return false;
            }
        }
        return true;
    }
}

class Key {
    constructor(arr) {
        this.arr = arr.slice();
        for(let i = 0; i < 5; i++) {
            //this.arr[i] = 7 - this.arr[i];
        }
    }
}

function parseGrid(grid) {
    let [n, m] = [grid.length, grid[0].length];
    let res = Array.from({length: m}, () => 0);
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (grid[i][j] === '#') {
                res[j] += 1;
            }
        }
    }

    if (grid[0][0] === '#') {
        return new Lock(res);
    }
    else if (grid[0][0] === '.') {
        return new Key(res);
    }
    else {
        throw new Error("Uhh something went wrong when parsing the grid. ");
    }
}

fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.replaceAll('\r', '');
    data = data.trim().split('\n\n');
    let seq = [];
    
    data.forEach((grid) => {
        grid = grid.trim().split('\n');
        print(grid);
        seq.push(parseGrid(grid));
    })
    print(seq);

    let totalFit = 0;
    for(let i = 0; i < seq.length; i++) {
        for(let j = 0; j < seq.length; j++) {
            if ((seq[i] instanceof Lock) && (seq[j] instanceof Key)) {
                if (seq[i].fitsWith(seq[j])) {
                    totalFit += 1;
                }
            }
        }
    }

    print(totalFit);
})