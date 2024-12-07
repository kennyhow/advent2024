const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (_, data) => {
    data = data.trim().split('\n');
    data = data.map((line) => line.split(""));
    
    let [x, y] = [0, 0];
    let [n, m] = [data.length, data[0].length]; 
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (data[i][j] == '^') {
                [x, y] = [i, j];
                data[i][j] = '.';
            }
        }
    }

    let [start_x, start_y] = [x, y];

    let direction = 'up';
    let movement = {'up': [-1, 0], 'down': [1, 0], 'left': [0, -1], 'right': [0, 1]};
    let visitedStates = new Set(); // contains [x, y, direction] tuple

    const nextDirection = (direction) => {
        let directions = ['up', 'right', 'down', 'left', 'up'];
        return directions[directions.indexOf(direction) + 1];
    };

    const outOfBoard = (x, y) => {
        return x < 0 || y < 0 || x >= n || y >= m;
    };

    const cannotMoveThere = (x, y) => {
        return data[x][y] == '#';
    };

    for(let i = 0; i < n * m; i++) {
        if (visitedStates.has(JSON.stringify([x, y, direction]))) {
            console.log(`duplicate at ${[x, y, direction]}`)
            break;
        }
        visitedStates.add(JSON.stringify([x, y, direction]));

        let [dx, dy] = movement[direction];
        let [next_x, next_y] = [x + dx, y + dy];

        //console.log(`${[next_x, next_y]}`)

        if (outOfBoard(next_x, next_y)) break;
        if (cannotMoveThere(next_x, next_y)) {
            direction = nextDirection(direction);
        }
        else {
            [x, y] = [next_x, next_y];
        }
    }

    let uniqueSquares = new
        Set(Array.from(visitedStates)
        .map((x) => JSON.parse(x))
        .map(([x, y, direction]) => JSON.stringify([x, y])));

    uniqueSquares = Array.from(uniqueSquares)
                    .map((x) => JSON.parse(x)); // contains [x, y] now

    const loops = (ox, oy) => {
        let visitedStates = new Set();
        let direction = 'up';
        let [x, y] = [start_x, start_y];

        for(let i = 0; ; i++) {
            if (visitedStates.has(JSON.stringify([x, y, direction]))) {
                return true;
                break;
            }
            visitedStates.add(JSON.stringify([x, y, direction]));
    
            let [dx, dy] = movement[direction];
            let [next_x, next_y] = [x + dx, y + dy];
    
            // console.log(`${[next_x, next_y]}`)
    
            if (outOfBoard(next_x, next_y)) {
                return false;
            }
            if (cannotMoveThere(next_x, next_y) || (next_x == ox && next_y == oy)) {
                direction = nextDirection(direction);
            }
            else {
                [x, y] = [next_x, next_y];
            }
        }    
    }
    
    let obstacles = 0;
    uniqueSquares.forEach(([x, y]) => {
        if (x == start_x && y == start_y) return;
        if (loops(x, y)) obstacles += 1;
    });
    console.log(obstacles);
});