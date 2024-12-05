const fs = require('fs');

const search = (data, directions) => {
    let ans = 0;
    console.log(directions);
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < data[i].length; j++) {
            let most_i = i + 3 * directions[0], most_j = j + 3 * directions[1];
            if (most_i < 0 || most_j < 0 || most_i >= data.length || most_j >= data[i].length) {
                continue;
            }

            let is_xmas = true;
            for(let k = 0; k < 4; k++) {
                if (data[i + directions[0] * k][j + directions[1] * k] !== 'XMAS'[k]) {
                    is_xmas = false;
                }
            }
            if (is_xmas) ans += 1;
        }
    }
    return ans;
};

const searchCross = (data, directions) => {
    let ans = 0;
    let [x, y] = directions;
    for(let i = 1; i < data.length - 1; i++) {
        for(let j = 1; j < data[i].length - 1; j++) {
            let first_wing = [], second_wing = [];
            for(let k = -1; k <= 1; k++) {
                first_wing.push(data[i + k * (-x)][j + k * y]);
                second_wing.push(data[i + k * x][j + k * y]);
            }
            first_wing.sort(); second_wing.sort();
            first_wing = first_wing.join('');
            second_wing = second_wing.join('');
            
            if (first_wing === 'AMS' && second_wing === 'AMS' && data[i][j] === 'A') {
                ans += 1;
                console.log(first_wing, second_wing, data[i][j]);
            }
        }
    }
    return ans;
};

fs.readFile('input.txt', 'utf-8', (_, data) => {
    data = data.trim().split('\n');
    console.log(data);

    let ans = 0;
    directions = [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    directions.forEach(element => {
        ans += search(data, element);
    });

    console.log(ans);

    ans = 0;
    directions = [[1, 1]];
    directions.forEach(element => {
        ans += searchCross(data, element);
    });
    console.log("ans is ", ans);
});