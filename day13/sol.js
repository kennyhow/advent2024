const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split('\n');
    let button1 = [], button2 = [];
    let prize = [];

    let buttonRegex = /X\+(\d+), Y\+(\d+)/
    let prizeRegex = /X=(\d+), Y=(\d+)/

    for(let i = 0; i < data.length; i += 4) {
        button1.push(buttonRegex.exec(data[i]).slice(1, 3).map(Number))
        button2.push(buttonRegex.exec(data[i + 1]).slice(1, 3).map(Number))
        prize.push(prizeRegex.exec(data[i + 2]).slice(1, 3).map(Number))
    }

    let n = prize.length;
    let cost = 0;
    for(let index = 0; index < n; index++) {
        let [x1, y1] = button1[index];
        let [x2, y2] = button2[index];
        let [res1, res2] = prize[index];

        for(let bCount = 0; bCount <= 100; bCount++) {
            let [x, y] = [res1 - bCount * x2, res2 - bCount * y2];
            if (x < 0 || y < 0) continue;
            if (x % x1!== 0 || y % y1 !== 0) continue;
            if (Math.floor(x / x1) !== Math.floor(y / y1)) continue;
            cost += 3 * (Math.floor(x / x1)) + bCount;
        }
    }
    console.log(cost);
})