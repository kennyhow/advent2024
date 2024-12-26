const fs = require('fs');
const print = console.log;

fs.readFile('input.txt', 'utf-8', (err, data) => {
    let nums = data.trim().split('\n').map(Number);

    const mod = 16777216n;
    const getNext = (n) => {
        n = BigInt(n);
        n = (n ^ (64n * n)) % mod;
        n = (n ^ (n / 32n)) % mod;
        n = (n ^ (2048n * n)) % mod;
        return n;
    }
    
    const getKthNumber = (n, k) => {
        n = BigInt(n);
        for(let i = 0; i < k; i++) {
            n = getNext(n);
        }
        return n;
    }

    print(`nums is ${nums}`)
    print(nums.map((n) => getKthNumber(n, 2000)).map(Number).reduce((acc, n) => acc + n));

    const getPrices = (start) => {
        let result = new Map(); // result.get(JSON string) => value
        let window = Array.from({length: 5}, (_, index) => getKthNumber(start, index)).map(Number);
        let differenceWindow = Array.from({length: 4}, (_, index) => (window[index + 1] % 10) - (window[index] % 10));

        for(let k = 0; k < 2000 - 4; k++) { // number of unique elems < mod
            let current = JSON.stringify(differenceWindow);
            if (!result.has(JSON.stringify(differenceWindow))) {
                result.set(JSON.stringify(differenceWindow), window[window.length - 1] % 10);
            }

            window.push(Number(getNext(window[window.length - 1])));
            window.shift();

            differenceWindow.push((window[window.length - 1] % 10) - (window[window.length - 2] % 10));
            differenceWindow.shift();
        }

        // print(`found ${result}`);
        return result;
    }

    let prices = nums.map(getPrices);

    let ranges = [];
    for(let k = -9; k <= 9; k++) {
        ranges.push(k);
    }
    
    let bestPrice = 0;
    for(let a of ranges) {
        for(let b of ranges) {
            for(let c of ranges) {
                print(a, b, c);
                for(let d of ranges) {
                    let current = JSON.stringify([a, b, c, d]);
                    let currentPrice = 0;
                    for (let price of prices) {
                        if (price.has(current)) {
                            currentPrice += price.get(current);
                        }
                    }
                    if (currentPrice > bestPrice) {
                        bestPrice = currentPrice;
                    }
                }
            }
        }
    }


    print(`bestPrice is ${bestPrice}`);
})