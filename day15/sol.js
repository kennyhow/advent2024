const fs = require('fs');
fs.readFile('input.2.txt', 'utf-8', (err, data) => {
    const parseInput = (data) => {
        data = data.trim().split('\n').map((line) => line.trim());
        let grid = [], steps = [];
        
        let midpoint = false;
        data.forEach((line) => {
            if (line === '') midpoint = true;
            else {
                if (midpoint) {
                    steps.push(line);
                }
                else {
                    grid.push(line.split(''));
                }
            }
        })
        return [grid, steps[0]];
    }

    let [grid, steps] = parseInput(data);

    const getDeltaFromDirection = (direction) => {
        switch(direction) {
            case '^':
                return [-1, 0];
            case 'v':
                return [1, 0];
            case '>':
                return [0, 1];
            case '<':
                return [0, -1];
        }
        throw new Error("Invalid direction"); 
    }

    const getNextCell = (direction, x, y) => {
        // get first non-O cell in direction
        let [dx, dy] = getDeltaFromDirection(direction);
        for(let steps = 1; ; steps++) {
            let [x_new, y_new] = [x + steps * dx, y + steps * dy];
            if (grid[x_new][y_new] !== 'O') {
                return [x_new, y_new];
            }
        }
        throw new Error("Reached out of grid in getNextCell");
    }
    
    const push = (direction, x, y) => {
        let [x_new, y_new] = getNextCell(direction, x, y);
        if (grid[x_new][y_new] === '#') {
            // cannot push
        }
        else {
            if (Math.abs(x_new - x) + Math.abs(y_new - y) == 1) {
                // `@.` => `.@`
                grid[x_new][y_new] = '@';
                grid[x][y] = '.';
            }
            else {
                // `@OO.` => `.@OO`
                // i.e. change (x, y), next(x, y), and (x_new, y_new)
                // to `.`, `@`, and `O` respectively

                let [dx, dy] = getDeltaFromDirection(direction);
                let [next_x, next_y] = [x + dx, y + dy];

                grid[x][y] = '.';
                grid[next_x][next_y] = '@';
                grid[x_new][y_new] = 'O';
            }
        }
    }
})