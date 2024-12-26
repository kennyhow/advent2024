const fs = require('fs');
let print = console.log;

fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split('\n').map((line) => line.trim());
    print(data)

    let positionOfNumpad = {
        '7': [0, 0],
        '8': [0, 1],
        '9': [0, 2],
        '4': [1, 0], 
        '5': [1, 1],
        '6': [1, 2],
        '1': [2, 0],
        '2': [2, 1],
        '3': [2, 2],
        '0': [3, 1], 
        'A': [3, 2]
    }

    let positionOfArrow = {
        '^': [0, 1],
        'A': [0, 2],
        '<': [1, 0], 
        'v': [1, 1],
        '>': [1, 2]
    }

    // let us denote the states of the 1st, 2nd, and 3rd robots
    // as ([x1, y1], [x2, y2], [x3, y3]) equivalent to (c1, c2, c3)
    // the number of possible states is 5 * 5 * 11 which is small-ish
    // to enter some char c, the state needs to be (A, A, c)

    // therefore let us precompute the distances between pairs of states, with the following transitions
    // I press arrow key - (c1, c2, c3) => (c1 + delta, c2, c3) regardless of value of c_i
    // I press A -
    // assume c1 != A. Then, (c1, c2, c3) => (c1, c2 + delta(c1), c3)
    // suppose c1 = A. Then, assume c2 != A. (c1, c2, c3) => (c1, c2, c3 + delta(c2)). 
    //                 Otherwise, assume c2 = A. (c1, c2, c3). This is a sink node. 
    let adjacencyList = new Map(); // map[c1 + c2 + c3] => list of neighbouring states
    let arrowChars = '^v<>A', numChars = '7894561230A';

    const moveInDirection_arrow = (direction, currentArrow) => {
        if (direction === 'A') throw new Error("uhh what");
        const directionToDelta = {
            'v': [1, 0], 
            '^': [-1, 0], 
            '>': [0, 1], 
            '<': [0, -1]
        };
        let [dx, dy] = directionToDelta[direction];
        let [x, y] = positionOfArrow[currentArrow];
        x += dx;
        y += dy;
        for(let [arrow, position] of Object.entries(positionOfArrow)) {
            if (JSON.stringify(position) === JSON.stringify([x, y])) {
                return arrow;
            }
        }
        return '';
    }

    const moveInDirection_numpad = (direction, currentDigit) => {
        if (direction === 'A') throw new Error("uhh what");
        const directionToDelta = {
            'v': [1, 0], 
            '^': [-1, 0], 
            '>': [0, 1], 
            '<': [0, -1]
        };
        let [dx, dy] = directionToDelta[direction];
        let [x, y] = positionOfNumpad[currentDigit];
        x += dx;
        y += dy;
        for(let [digit, position] of Object.entries(positionOfNumpad)) {
            if (JSON.stringify(position) === JSON.stringify([x, y])) {
                return digit;
            }
        }
        return '';
    }

    const getTransitionStates = (c1, c2, c3) => {
        let s = c1 + c2 + c3;
        let result = new Set(); // contains 'def' e.g. 

        // i press an arrow key
        let [x, y] = positionOfArrow[c1];
        for (const [arrow, position] of Object.entries(positionOfArrow)) {
            if (Math.abs(position[0] - x) + Math.abs(position[1] - y) === 1) {
                result.add(arrow + c2 + c3);
            }
        }

        // assume i press A
        if (c1 !== 'A') {
            let new_c2 = moveInDirection_arrow(c1, c2);
            if (new_c2 !== '') {
                result.add(c1 + new_c2 + c3);
            }
        }
        else {
            if (c2 !== 'A') {
                let new_c3 = moveInDirection_numpad(c2, c3);
                if (new_c3 !== '') {
                    result.add(c1 + c2 + new_c3);
                }
            }
            else {
                // DONT DO ANYTHING 
            }
        }

        return result;
    }

    let allStates = [];
    for(let c1 of arrowChars) {
        for(let c2 of arrowChars) {
            for(let c3 of numChars) {
                allStates.push(c1 + c2 + c3);
                adjacencyList.set(c1 + c2 + c3, getTransitionStates(c1, c2, c3));
            }
        }
    }

    // e.g. for input 029A, the answer is distance(AAA, AA0) + 1 + distance(AA0, AA2) + 1 + distance(AA2, AA9) + 1 + distance(AA9, AAA) + 1
    let distance = new Map(); // dist(abc, def) = distance(abcdef)
    let INF = 9999999999;
    for(let abc of allStates) {
        for(let def of allStates) {
            if (abc === def) {
                distance.set(abc + def, 0);
            }
            else if (adjacencyList.get(abc).has(def)) {
                distance.set(abc + def, 1);
            }
            else {
                distance.set(abc + def, INF);
            }
        }
    }
    for(let middle of allStates) {
        for(let abc of allStates) {
            for(let def of allStates) {
                distance.set(abc + def, Math.min(distance.get(abc + def), distance.get(abc + middle) + distance.get(middle + def)));
            }
        }
    }

    const getComplexity = (s) => {
        let digit = Number(s.slice(0, 3));
        let dist = distance.get('AAA' + 'AA' + s[0]) + distance.get('AA' + s[0] + 'AA' + s[1]) + distance.get('AA' + s[1] + 'AA' + s[2]) + distance.get('AA' + s[2] + 'AAA') + 4;
        return digit * dist;
    }

    let result = data.map(getComplexity);
    print(result);
    print(result.reduce((acc, x) => acc + x), 0);

})