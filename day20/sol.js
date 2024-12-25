const fs = require('fs');
let print = console.log;

fs.readFile('input.txt', 'utf-8', (err, data) => {
    let grid = data.trim().split('\n').map((line) => line.trim().split(''));
    let [n, m] = [grid.length, grid[0].length];
    let INF = 999999999;
    let distance = Array.from({length: n}, () => Array.from({length: m}, () => INF)); // dist(S, current)
    let distance2 = Array.from({length: n}, () => Array.from({length: m}, () => INF)); // dist(E, current)

    let [xStart, yStart, xEnd, yEnd] = [0, 0, 0, 0];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (grid[i][j] === 'S') {
                [xStart, yStart] = [i, j];
            }
            if (grid[i][j] === 'E') {
                [xEnd, yEnd] = [i, j];
            }
        }
    }

    const getNeighbours = (x, y) => {
        let cells = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        return cells.filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < m && grid[a][b] !== '#');
    }

    

    // bfs is easier, and just works lmao
    let queue = [];
    queue.push([xStart, yStart]);
    distance[xStart][yStart] = 0;
    while(queue.length > 0) {
        let [x, y] = queue.shift();
        for (let [a, b] of getNeighbours(x, y)) {
            if (distance[a][b] > distance[x][y] + 1) {
                distance[a][b] = distance[x][y] + 1;
                queue.push([a, b, distance[a][b] + 1]);
            }
        }
    }
    queue = [];
    distance2[xEnd][yEnd] = 0;
    queue.push([xEnd, yEnd])
    while(queue.length > 0) {
        let [x, y] = queue.shift();
        for (let [a, b] of getNeighbours(x, y)) {
            if (distance2[a][b] > distance2[x][y] + 1) {
                distance2[a][b] = distance2[x][y] + 1;
                queue.push([a, b, distance2[a][b] + 1]);
            }
        }
    }

    const getPossibleCheatPositions = (x, y) => {
        let adjacentCells = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < m && grid[a][b] === '#');

        // if (x === 7 && y === 7) {
        //     print(adjacentCells);
        // }

        let cheatPositions = [];
        let result = adjacentCells.map(([a, b]) => {
            let nextCells = [[a - 1, b], [a + 1, b], [a, b - 1], [a, b + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n && b < m && grid[a][b] !== '#' && !(a == x && b == y));

            // if (x === 7 && y === 7) {
            //     print(`pushing ${nextCells}`)
            // }
            cheatPositions.push(...nextCells);
        })
        return cheatPositions;
    }


    let total = 0, finalDistance = distance[xEnd][yEnd];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (grid[i][j] === '#') continue;
            if (i == 7 && j == 8) {
                print(JSON.stringify(getPossibleCheatPositions(i, j)))
            }
            for(let [a, b] of getPossibleCheatPositions(i, j)) {
                if (finalDistance - (distance[i][j] + distance2[a][b]) - 2 >= 100) {
                    print(`adding i, j ${[i, j]}`)
                    total += 1;
                }
            }
        }
    }
    print(`total is ${total}`);
    total = 0;

    for(let x1 = 0; x1 < n; x1++) {
        for(let y1 = 0; y1 < m; y1++) {
            for(let x2 = 0; x2 < n; x2++) {
                for(let y2 = 0; y2 < m; y2++) {
                    if (Math.abs(x1 - x2) + Math.abs(y1 - y2) > 20) continue;
                    let currentDistance = distance[x1][y1] + distance2[x2][y2] + Math.abs(x1 - x2) + Math.abs(y1 - y2);
                    if (finalDistance - currentDistance >= 100) {
                        total += 1;
                    }
                }
            }
        }
    }

    print(`final total is ${total}`)
})