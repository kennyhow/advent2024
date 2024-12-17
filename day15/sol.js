const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (err, data) => {
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
        return [grid, steps.join('')];
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
    
    const push = (direction, x, y) => { // also returns coordinates of `@` after push
        let [x_new, y_new] = getNextCell(direction, x, y);
        if (grid[x_new][y_new] === '#') {
            // cannot push
            return [x, y];
        }
        else {
            if (Math.abs(x_new - x) + Math.abs(y_new - y) == 1) {
                // `@.` => `.@`
                grid[x_new][y_new] = '@';
                grid[x][y] = '.';

                return [x_new, y_new];
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

                return [next_x, next_y];
            }
        }
    }

    let [x, y] = [0, 0];
    let [n, m] = [grid.length, grid[0].length];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {
            if (grid[i][j] === '@') {
                [x, y] = [i, j];
            }
        }
    }

    steps.split('').forEach((c) => {
        [x, y] = push(c, x, y);
        // console.log(grid.map((line) => line.join('')).join('\n'));
    })
    //console.log(grid.map((line) => line.join('')).join('\n'));


    const calcGPS = () => {
        let total = 0;
        for(let i = 0; i < n; i++) {
            for(let j = 0; j < m; j++) {
                if (grid[i][j] === 'O') {
                    total += 100 * i + j;
                }
            }
        }
        return total;
    }

    //console.log(calcGPS());
})

fs.readFile('input.3.txt', 'utf-8', (err, data) => {
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
                    console.log(`line is ${line}`);
                    console.log(`after transformation, line is now ${line
                        .replace(/\./g, '..')
                        .replace(/#/g, '##')
                        .replace(/O/g, '[]')
                        .replace(/@/g, '@.')}`)
                    grid.push(line
                        .replace(/\./g, '..')
                        .replace(/#/g, '##')
                        .replace(/O/g, '[]')
                        .replace(/@/g, '@.'));
                }
            }
        })
        return [grid, steps.join('')];
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

    const getFrontiers = (direction, x, y) => {
        
    }

    const forcePush = (direction, x, y) => {

    }

    const pushVertical = (direction, x, y) => {
        let [dx, dy] = getDeltaFromDirection(direction);
        let frontier = getFrontiers(direction, x, y);

        let canPush = true;
        frontier.forEach(([x_new, y_new]) => {
            canPush &= (grid[x_new + dx][y_new + dy] === '.');
        })
        if (!canPush) return [x, y];
        else {
            forcePush(direction, x, y);
            return [x + dx, y + dy];
        }
    }

    const pushHorizontal = (direction, x, y) => {
        let [dx, dy] = getDeltaFromDirection(direction);
        for(let steps = 1; ; steps++) {
            let cell = grid[x + dx * steps][y + dy * steps]
            if (cell === '#') {
                // cannot push
                return [x, y];
            }
            else if (cell === '.') {
                // @[][]. => .@[][]
                for(let k = steps; k >= 1; k--) {
                    grid[x + k * dx][y + k * dy] = grid[x + (k - 1) * dx][y + (k - 1) * dy];
                }

                grid[x][y] = '.';
                return [x + dx, y + dy];
            }
        }
    }

    const push = (direction, x, y) => {
        if ('^v'.includes(direction)) {
            return pushVertical(direction, x, y);
        }
        else {
            return pushHorizontal(direction, x, y);
        }
    }
})