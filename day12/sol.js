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
                console.log(`${[i, j, data[i][j]]}, size=${size[i][j]}, perimeter=${perimeter[i][j]}`)
                answer += perimeter[i][j] * size[i][j];
            }
        }
    }
    console.log(answer);
})