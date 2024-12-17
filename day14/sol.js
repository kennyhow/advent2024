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
})