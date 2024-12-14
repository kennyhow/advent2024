const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (err, data) => {
    data = data.trim().split(' ').map(Number);
    console.log(data);

    const changeStone = (n) => {
        if (n == 0) {
            return [1];
        }
        else if (n.toString().length % 2 === 0) {
            let middle = Math.floor(n.toString().length / 2);
            let [a, b] = [n.toString().slice(0, middle), n.toString().slice(middle)]
            return [Number(a), Number(b)];
        }
        else {
            return [n * 2024];
        }
    }

    const blink = (data) => {
        let result = [];
        data.forEach((x) => {
            result.push(...changeStone(x));
        })
        return result;
    }

    let data2 = data.slice();

    for(let i = 0; i < 25; i++) {
        data = blink(data);
        // console.log(data);
    }
    console.log(data.length)

    let memo = new Map();
    const changeStone2 = (n) => {
        if (memo.has(n)) return memo.get(n);
        else {
            memo.set(n, changeStone(n));
            return memo.get(n);
        }
    }

    const blink2 = (data) => {
        let result = new Map();
        data.forEach((freq, n) => {
            let newStones = changeStone2(n);
            newStones.forEach((stone) => {
                if (!result.has(stone)) result.set(stone, 0);
                result.set(stone, result.get(stone) + freq);
            })
            return newStones;
        })
        return result;
    }

    let current = new Map();
    data2.forEach((x) => {
        if (!current.has(x)) current.set(x, 0);
        current.set(x, current.get(x) + 1);
    })

    const debug = (dictionary) => {
        dictionary.forEach((key, value) => {
            console.log(`freq of ${key} is ${value}`)
        })
    }

    for(let i = 0; i < 75; i++) {
        current = blink2(current);
    }

    let total = 0;
    for (let [n, freq] of current.entries()) {
        total += freq;
    }
    console.log(total);
})