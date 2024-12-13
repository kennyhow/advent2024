const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split('\n').map((line) => line.trim())
    data = data.map((line) => {
        line = line.split('').map((value) => Number(value))
        return line;
    })
    
    let [n, m] = [data.length, data[0].length]
    let answer = Array.from({length: n}, () => {
        return Array.from({length: m}, () => {
            return new Set();
        })
    })

    const inGrid = ([x, y]) => {
        return x >= 0 && y >= 0 && x < n && y < m;
    }

    const getNeighbours = (x, y) => {
        let deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        return deltas.map(([a, b]) => {
            return [a + x, b + y];
        }).filter(inGrid)
    }


    for(let value = 9; value >= 0; value--) {
        for(let i = 0; i < n; i++) {
            for(let j = 0; j < m; j++) {
                if (data[i][j] !== value) continue;
                if (data[i][j] == 9) {
                    answer[i][j].add(JSON.stringify([i, j]));
                }
                else {
                    let neighbours = getNeighbours(i, j);
                    for(let [x, y] of neighbours) {
                        if (data[x][y] == value + 1) {
                            answer[x][y].forEach((coordinates) => {
                                answer[i][j].add(coordinates);
                            })
                        }
                    }
                }
            }
        }
    }

    let total = 0;
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (data[i][j] == 0) {
                total += answer[i][j].size;
            }
        }
    }

    console.log(total)

    for(let value = 9; value >= 0; value--) {
        for(let i = 0; i < n; i++) {
            for(let j = 0; j < m; j++) {
                if (data[i][j] !== value) continue;
                if (value === 9) answer[i][j] = 1;
                else {
                    answer[i][j] = 0;
                    let neighbours = getNeighbours(i, j);
                    neighbours.forEach(([x, y]) => {
                        if (data[x][y] == value + 1) {
                            answer[i][j] += answer[x][y];
                        }
                    })
                }
            }
        }
    }

    total = 0;
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (data[i][j] == 0) {
                total += answer[i][j];
            }
        }
    }
    console.log(total)

})