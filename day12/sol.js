const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split('\n').map((line) => line.trim())
    let [n, m] = [data.length, data[0].length]
    
    let perimeter = Array.from({length: n}, () => {
        return Array.from({length: m}, () => 0);
    })

    const inGrid = (x, y) => {
        return x >= 0 && y >= 0 && x < n && y < m
    }

    const getPerimeter = (x, y, value) => {
        let result = 4;
        let deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        deltas.forEach(([a, b]) => {
            let [x2, y2] = [x + a, y + b];
            if (inGrid(x2, y2) && data[x2][y2] === value) {
                result -= 1;
            }
        })
        return result;
    }



    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            perimeter[i][j] = getPerimeter(i, j, data[i][j]);
        }
    }

    let reps = Array.from({length: n}, (_, index1) => {
        return Array.from({length: m}, (_, index2) => {
            return [index1, index2];
        })
    })
    let size = Array.from({length: n}, () => {
        return Array.from({length: m}, () => {
            return 1;
        })
    })

    const unite = (x1, y1, x2, y2) => {
        let rep1 = getRep(x1, y1);
        let rep2 = getRep(x2, y2);
        if (JSON.stringify(rep1) === JSON.stringify(rep2)) return;
        [x1, y1] = rep1;
        [x2, y2] = rep2;

        if (size[x1][y1] > size[x2][y2]) {
            [x1, y1, x2, y2] = [x2, y2, x1, y1];
        }

        // size(first) <= size(second)
        // make second the representative
        size[x2][y2] += size[x1][y1];
        reps[x1][y1] = getRep(x2, y2);
    } 

    const getRep = (x, y) => {
        let [x2, y2] = reps[x][y];
        if (x2 !== x || y2 !== y) {
            reps[x][y] = getRep(x2, y2);
        }
        return reps[x][y];
    }

    for(let i = 0; i < n; i++)  {
        for(let j = 0; j < m; j++) {
            if (inGrid(i + 1, j) && data[i][j] === data[i + 1][j]) {
                unite(i, j, i + 1, j);
            }
            if (inGrid(i, j + 1) && data[i][j] === data[i][j + 1]) {
                unite(i, j, i, j + 1);
            }
        }
    }

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            let [a, b] = getRep(i, j);
            if (JSON.stringify([a, b]) === JSON.stringify([i, j])) continue;
            perimeter[a][b] += perimeter[i][j];
        }
    }

    let answer = 0;
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (JSON.stringify(getRep(i, j)) === JSON.stringify([i, j])) {
                // console.log(`${[i, j, data[i][j]]}, size=${size[i][j]}, perimeter=${perimeter[i][j]}`)
                answer += perimeter[i][j] * size[i][j];
            }
        }
    }
    console.log(answer);

    const getSides = (x, y) => {
        let deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let results = []; // [x, y, orientation]

        deltas.forEach(([a, b], index) => {
            let [x2, y2] = [x + a, y + b];
            if (!(inGrid(x2, y2) && data[x2][y2] === data[x][y])) {
                results.push([x, y, index])
            }
        })
        return results;
    }

    const mergeSides = (sides) => {
        // return number of unique sides
        sides = new Set(sides);

        // console.log(`sides is ${Array.from(sides).join(' ')}`)
        // console.log(`original size is ${sides.size}`)

        let deleted = new Set();
        let numSides = 0;
        sides.forEach((s) => {
            if (deleted.has(s)) return;
            // console.log(`unique side: ${s}`)
            numSides += 1;

            let [x, y, orientation] = JSON.parse(s);
            // 0 => down, 1 => up, 2 => right, 3 => left
            if (orientation === 0 || orientation === 1) {
                // move left/right
                for(let y2 = y + 1; y2 < m; y2++) {
                    if (sides.has(JSON.stringify([x, y2, orientation]))) {
                        deleted.add(JSON.stringify([x, y2, orientation]))
                    }
                    else break;
                }
                for(let y2 = y - 1; y2 >= 0; y2--) {
                    if (sides.has(JSON.stringify([x, y2, orientation]))) {
                        deleted.add(JSON.stringify([x, y2, orientation]))
                    }
                    else break;
                }
            }
            else {
                for(let x2 = x + 1; x2 < n; x2++) {
                    if (sides.has(JSON.stringify([x2, y, orientation]))) {
                        deleted.add(JSON.stringify([x2, y, orientation]))
                    }
                    else break;
                }
                for(let x2 = x - 1; x2 >= 0; x2--) {
                    if (sides.has(JSON.stringify([x2, y, orientation]))) {
                        deleted.add(JSON.stringify([x2, y, orientation]))
                    }
                    else break;
                }
            }
        })

        return numSides;
    }

    let sidesArray = Array.from({length: n}, () => {
        return Array.from({length: m}, () => new Set())
    }) // contains JSON.stringify([x, y, orientation])

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            let [a, b] = getRep(i, j);
            let currentSides = getSides(i, j);
            currentSides.forEach((s) => {
                sidesArray[a][b].add(JSON.stringify(s));
            })
        }
    }

    let total = 0;
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (JSON.stringify([i, j]) === JSON.stringify(getRep(i, j))) {
                let result = mergeSides(sidesArray[i][j]);
                // console.log(`${data[i][j]} has numSides=${result}`)
                total += result * size[i][j];
            }
        }
    }
    console.log(total);
})