const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
    const parseInput = (data) => {
        data = data.trim().split('\n');

        let regex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/
        let positions = [], velos = [];
        data.forEach((line) => {
            let result = regex.exec(line);
            positions.push(result.slice(1, 3).map(Number));
            velos.push(result.slice(3, 5).map(Number));
        })
        return [positions, velos];
    }

    let [positions, velos] = parseInput(data);
    // let [n, m] = [11, 7];
    let [n, m] = [101, 103];

    const getQuadrant = (x, y) => {
        if (2 * x + 1 == n || 2 * y + 1 == m) return -1; // in middle, ignore

        return ((x <= Math.floor(n / 2)) << 1) | (y <= Math.floor(m / 2));
    }

    const transform = (index, seconds) => {
        let [p1, p2] = positions[index];
        let [v1, v2] = velos[index];

        let [r1, r2] = [(p1 + v1 * seconds) % n, (p2 + v2 * seconds) % m];
        if (r1 < 0) r1 += n;
        if (r2 < 0) r2 += m;
        return [r1, r2];
    }

    let quadrantCounts = new Map();
    for(let i = -1; i < 4; i++) quadrantCounts.set(i, 0);

    for(let i = 0; i < positions.length; i++) {
        let [x, y] = transform(i, 100);
        // console.log(`transformed to ${x}, ${y}`)
        let quadrant = getQuadrant(x, y);
        quadrantCounts.set(quadrant, 1 + quadrantCounts.get(quadrant));
    }

    let product = 1;
    for(let i = 0; i < 4; i++) {
        product *= quadrantCounts.get(i);
    }
    console.log(product);

    const getHorizontalComplement = (x, y) => {
        // (x, y) => ((n - 1) - x, y)
        return [n - 1 - x, y];
    }

    const symmetric = (positions) => {
        // am guessing its symmetric across the vertical axis
        let markedPositions = new Set();
        positions.forEach(([x, y]) => {
            markedPositions.add(JSON.stringify([x, y]));
        })

        let isSymmetric = true;
        positions.forEach(([x, y]) => {
            let complement = getHorizontalComplement(x, y);
            if (!markedPositions.has(JSON.stringify(complement))) {
                isSymmetric = false;
                return;
            }
        })
        return isSymmetric;
    }

    const getGrid = (positions) => {        
        let grid = Array.from({length: m}, () => {
            return Array.from({length: n}, () => 0)
        })

        for(let i = 0; i < positions.length; i++) {
            let [x, y] = positions[i];
            grid[y][x] += 1;
        }

        return grid;
    }

    const getScore = (grid) => {
        let reps = Array.from({length: m}, (_, index1) => {
            return Array.from({length: n}, (_, index2) => {
                return [index1, index2];
            })
        })
        let size = Array.from({length: m}, () => {
            return Array.from({length: n}, () => {
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

        for(let i = 0; i < m - 1; i++) {
            for(let j = 0; j < n - 1; j++) {
                if (grid[i][j] === grid[i][j + 1]) {
                    unite(i, j, i, j + 1);
                }
                if (grid[i][j] === grid[i + 1][j]) {
                    unite(i, j, i + 1, j)
                }
            }
        }

        let score = 0;
        for(let i = 0; i < m; i++) {
            for(let j = 0; j < n; j++) {
                if (JSON.stringify([i, j]) == JSON.stringify(getRep(i, j))) {
                    score += 1;
                }
            }
        }

        return score;
    }

    let bestScore = 9999999999999;
    for(let seconds = 0; seconds < 100000000; seconds++) {
        let currentData = Array.from({length: positions.length}, (_, index) => index).map((index) => transform(index, seconds));
        let grid = getGrid(currentData);
        let score = getScore(grid);
        if (score < bestScore) {
            bestScore = score;
            console.log(grid.map((row) => row.join('')).join('\n'));
            console.log(`Score: ${score}\n`);
            console.log(`Seconds: ${seconds}`)
        }
    }
})