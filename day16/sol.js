const fs = require('fs');

class PriorityQueue { 
    constructor(comparator) {
        this.comparator = comparator; // comparator returns true iff a <= b
        this.heap = [0]; // dummy value
    }

    size() {
        return this.heap.length - 1;
    }

    push(value) {
        this.heap.push(value);
        let index = this.heap.length - 1;
        while(index > 1 && this.comparator(this.heap[index], this.heap[Math.floor(index / 2)])) {
            // bubble upwards
            [this.heap[index], this.heap[Math.floor(index / 2)]] = [ this.heap[Math.floor(index / 2)], this.heap[index]];
            index = Math.floor(index / 2);
        }
    }

    pop() {
        // returns min value
        let result = this.heap[1];
        this.heap[1] = this.heap[this.heap.length - 1];
        this.heap.pop();

        // bubble downwards
        let index = 1;
        while(true) {
            // if left child does not exist, we are done
            if (2 * index >= this.heap.length) break;

            let nextIndex = 2 * index; 
            let nextValue = this.heap[nextIndex];

            if (2 * index + 1 < this.heap.length && this.comparator(this.heap[nextIndex + 1], this.heap[nextIndex])) {
                // right child is smaller
                nextIndex += 1;
                nextValue = this.heap[nextIndex];
            }

            if (this.comparator(this.heap[nextIndex], this.heap[index])) {
                // swap
                [this.heap[nextIndex], this.heap[index]] = [this.heap[index], this.heap[nextIndex]];
                index = nextIndex;
            }
            else break;
        }
        return result;
    }
}

fs.readFile('input.txt', 'utf-8', (err, data) => {
    let grid = data.trim().split('\n').map((line) => line.split(''));
    
    // each element is [dist, x, y, orientation]
    const comparator = (a, b) => {
        // returns true iff dist(a) <= dist(b)
        return a[0] <= b[0];
    }

    let queue = new PriorityQueue(comparator);

    let [xStart, yStart, xEnd, yEnd] = [-1, -1, -1, -1];
    let [n, m] = [grid.length, grid[0].length];
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

    const INF = 1000000000000000;
    let distance = Array.from({length: n}, () => {
        return Array.from({length: m}, () => ({
            '>': INF,
            '<': INF,
            'v': INF,
            '^': INF
        }))
    });
    distance[xStart][yStart]['>'] = 0;

    const getDeltaFromOrientation = (orientation) => {
        switch(orientation) {
            case '^':
                return [-1, 0];
            case 'v':
                return [1, 0];
            case '>':
                return [0, 1];
            case '<':
                return [0, -1];
            default:
                throw new Error("invalid orientation");
        }
    }

    const nextOrientation = (orientation) => {
        let s = '>v<^';
        return s[(s.indexOf(orientation) + 1) % s.length];
    }

    const prevOrientation = (orientation) => {
        return nextOrientation(nextOrientation(nextOrientation(orientation)));
    }

    let getNextStates = (x, y, orientation) => {
        let [dx, dy] = getDeltaFromOrientation(orientation);
        let states = [];

        // move forward
        if (grid[x + dx][y + dy] !== '#') {
            states.push([1, x + dx, y + dy, orientation]);
        }

        states.push([1000, x, y, nextOrientation(orientation)]);
        states.push([1000, x, y, prevOrientation(orientation)]);

        return states;
    }

    queue.push([0, xStart, yStart, '>']);
    while(queue.size() > 0) {
        let [dist, x, y, orientation] = queue.pop();
        if (dist > distance[x][y][orientation]) continue;
        // console.log(`${[x, y, orientation]} has distance ${dist}`);

        let nextStates = getNextStates(x, y, orientation);
        nextStates.forEach(([d, x0, y0, nextOrientation]) => {
            // console.log(`LHS is ${distance[x0][y0][nextOrientation]} and RHS is ${distance[x][y][orientation] + d}`)
            if (distance[x0][y0][nextOrientation] <= distance[x][y][orientation] + d) return; // no point
            distance[x0][y0][nextOrientation] = distance[x][y][orientation] + d;

            // console.log(`pushing ${[distance[x0][y0][nextOrientation], x0, y0, orientation]}`)
            queue.push([distance[x0][y0][nextOrientation], x0, y0, nextOrientation]);
        })
    }

    let finalDist = Math.min(...Object.values(distance[xEnd][yEnd]));
    console.log(Math.min(...Object.values(distance[xEnd][yEnd])))

    let newGrid = Array.from({length: n}, () => {
        return Array.from({length: m}, () => ({
            '>': '.',
            '<': '.',
            'v': '.',
            '^': '.'
        }))
    });    

    // (x, y) is tile if there exists some neighbour (a, b)
    // such that dist(x, y) + transitionDistance = dist(a, b)
    // equiv dist(x, y) = dist(a, b) - d
    // we can just sort all states according to final distances, in descending order
    let allStates = [];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            for (let orientation of '^v<>') {
                allStates.push([i, j, orientation])
            }
        }
    }
    allStates.sort((a, b) => distance[a[0]][a[1]][a[2]] - distance[b[0]][b[1]][b[2]]);
    allStates = allStates.reverse(); // in descending order

    //newGrid[xEnd][yEnd] = 'O';
    for(let [orientation, dist] of Object.entries(distance[xEnd][yEnd])) {
        if (dist == finalDist) {
            newGrid[xEnd][yEnd][orientation] = 'O';
        }
    }

    getNextStates = (x, y, orientation) => {
        let [dx, dy] = getDeltaFromOrientation(orientation);
        let states = [[1000, x, y, nextOrientation(orientation)], [1000, x, y, prevOrientation(orientation)]];

        if (grid[x - dx][y - dy] !== '#') {
            states.push([1, x - dx, y - dy, orientation]);
        }
        console.log(`states is ${states}`)
        return states;
    }

    allStates.forEach(([x, y, orientation]) => {
        if (newGrid[x][y][orientation] === 'O') {
            // induct backwards
            let nextStates = getNextStates(x, y, orientation);
            nextStates.forEach(([d, nextX, nextY, nextOrientation]) => {
                if (distance[nextX][nextY][nextOrientation] === distance[x][y][orientation] - d) {
                    newGrid[nextX][nextY][nextOrientation] = 'O';
                }
            })
        }
    })


    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            let isTile = false;
            for(let cell of Object.values(newGrid[i][j])) {
                isTile |= (cell === 'O');
            }
            grid[i][j] = (isTile ? 'O' : '.');
        }
    }
    let finalGrid = grid.map((row) => row.join('')).join('\n');
    let numTiles = finalGrid.split('').filter((c) => (c === 'O')).length;
    console.log(numTiles);
})