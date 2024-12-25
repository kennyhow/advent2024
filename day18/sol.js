const fs = require('fs');
let print = console.log;

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

class Dist {
    constructor(distance, point) {
        this.distance = distance;
        this.point = point;
    }
}

fs.readFile('input.txt', 'utf-8', (err, data) => {
    let [n, m] = [71, 71];
    data = data.trim().split('\n');
    
    let regex = /(\d+),(\d+)/
    let points = data.map((line) => {
        // print(regex.exec(line).slice(1, 3).map(Number))
        return regex.exec(line).slice(1, 3).map(Number);
    }).slice(0, 1024);
    
    // print(`points is ${points}`)
    let grid = Array.from({length: n}, () => Array.from({length: m}, () => '.'));
    points.forEach(([x, y]) => {
        grid[x][y] = '#';
        // print(grid.map((row) => row.join('')).join('\n'));
        // print();
    })

    // print(grid);

    let INF = 9999999999;
    let distance = Array.from({length: n}, () => Array.from({length: m}, () => INF));
    distance[0][0] = 0;
    
    const comparator = (p1, p2) => {
        return p1.dist <= p2.dist;
    }
    const queue = new PriorityQueue(comparator);
    queue.push(new Dist(0, [0, 0]));

    const getNeighbours = ([x, y]) => {
        let res = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        let ans = [];
        for(let [a, b] of res) {
            // print(`a is ${a} and b is ${b}`)
            if (a >= 0 && b >= 0 && a < n && b < m && grid[a][b] === '.') {
                ans.push([a, b]);
            }
        }
        return ans;
    }

    while(queue.size() > 0) {
        const currentDistance = queue.pop();
        let [dist, point] = [currentDistance.distance, currentDistance.point];
        if (distance[point[0]][point[1]] == dist) {
            for (let [x, y] of getNeighbours(point)) {
                if (distance[x][y] > dist + 1) {
                    distance[x][y] = dist + 1;
                    queue.push(new Dist(distance[x][y], [x, y]));
                }
            }
        }
    }
    print(distance[n - 1][m - 1]);
})