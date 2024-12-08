// thx chatgpt <3
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (_, data) => {
    data = data.trim().split('\n')
    data = data.map((line) => line.trim().split(''));
    
    locations = new Map();
    let [n, m] = [data.length, data[0].length];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (data[i][j] != '.') {
                const current = data[i][j];
                if (!locations.has(current)) {
                    locations.set(current, []);
                }
                locations.get(current).push([i, j])
            }
        }
    }

    console.log(locations)

    const inGrid = (x, y) => {
        return x >= 0 && y >= 0 && x < n && y < m;
    }

    const getNodes = (nodes, locations) => {
        for(let i = 0; i < locations.length; i++) {
            let [x1, y1] = locations[i];
            for(let j = 0; j < i; j++) {
                let [x2, y2] = locations[j];
                let [dx, dy] = [x2 - x1, y2 - y1];
                let divisor = Math.abs(gcd(dx, dy));
                console.log(`divisor is ${divisor}`)
                dx = Math.floor(dx / divisor)
                dy = Math.floor(dy / divisor)

                let change = true;
                for(let k = 0; change; k++) {
                    change = false;
                    let [x3, y3] = [x2 + k * dx, y2 + k * dy]
                    let [x4, y4] = [x1 - k * dx, y1 - k * dy]

                    if (inGrid(x3, y3)) {
                        nodes.add(JSON.stringify([x3, y3]))
                        change = true;
                    }
                    if (inGrid(x4, y4)) {
                        nodes.add(JSON.stringify([x4, y4]))
                        change = true;
                    }
                }

                // x2 + d, x1 - d
                let [x3, y3] = [x2 + dx, y2 + dy]
                let [x4, y4] = [x1 - dx, y1 - dy]

                if (inGrid(x3, y3)) nodes.add(JSON.stringify([x3, y3]))
                if (inGrid(x4, y4)) nodes.add(JSON.stringify([x4, y4]))
            }
        }
    }

    let nodes = new Set();
    locations.forEach((location) => {
        getNodes(nodes, location)
        
    })
    console.log(nodes.size)
    let nodesArr = Array.from(nodes).map((elem) => JSON.parse(elem)).sort();
    nodesArr.forEach(([x, y]) => {
        data[x][y] ='#'
    })

    console.log(nodesArr)

    data.forEach((line) => console.log(line.join('')))

    console.log(nodesArr.length)
})