// thx chatgpt <3
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}


const fs = require('fs');
const math = require('mathjs');

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

    // aCount * (button1) + bCount * (button2) = (prize), vectors in N
    // a * (x1, y1) + b * (x2, y2) = (r1, r2)
    // (a * x1 + b * x2) == r1, etc
    // if (x1, y1) is linearly independent from (x2, y2), answer is unique and trivial to find
    // otherwise, let d = gcd(...). then, we reduce this problem to
    // a * k1 + b * k2 = k3, for k_i in N
    // impossible if gcd(k1, k2) does not divide k3
    // so wlog assume gcd(k1, k2) = 1
    // a = k3 / k1 (mod k2) and b = k3 / k2 (mod k1)
    // claim (unfounded): any value of a gives an appropriate value of k1
    // so we just take the minimum value (which is the principal value)

    
    
    cost = 0;
    for(let index = 0; index < n; index++) {
        let [x1, y1] = button1[index];
        let [x2, y2] = button2[index];
        let [res1, res2] = prize[index];
        [res1, res2] = [res1 + 10000000000000, res2 + 10000000000000];

        const independent = ([a, b], [c, d]) => {
            // a/b = c/d iff ad = bc
            return (a * d !== b * c);
        }

        // if linearly independent
        if (independent([x1, y1], [x2, y2])) {
            // a(x1, y1) + b(x2, y2) = (r1, r2)
            // x * M = res
            let M = math.transpose(math.matrix([[x1, y1], [x2, y2]]));
            let res = math.matrix([res1, res2]);
            let x = math.lusolve(M, res)._data;
            let [a, b] = x.map(Math.round);
            
            if (a * x1 + b * x2 == res1 && a * y1 + b * y2 == res2 && a >= 0 && b >= 0) {
                cost += 3 * a + b;
            }
        }
        else {
            console.log("DEPENDENT!!!!!");
        }
    }
    console.log(cost);
})