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
    
})