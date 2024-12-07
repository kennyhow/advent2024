const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (_, data) => {
    let result = [], numbers = [];

    data = data.trim().split('\n');
    data.forEach((line) => {
        let [res, nums] = line.split(': ');
        result.push(Number(res));

        nums = nums.split(' ').map(Number);
        numbers.push(nums)
    })

    const concat = (a, b) => {
        return Number(a.toString() + b.toString());
    }

    const determinePossible = (target, currentValue, numbers, index) => {
        // console.log(`target is ${target} and current is ${currentValue} and numbers is ${numbers}`)
        if (index >= numbers.length) {
            return target == currentValue;
        }

        return determinePossible(target, currentValue + numbers[index], numbers, index + 1) ||
        determinePossible(target, currentValue * numbers[index], numbers, index + 1) ||
        determinePossible(target, concat(currentValue, numbers[index], numbers, index + 1), numbers, index + 1);
    }

    let total = 0;
    result.forEach((value, index) => {
        if (determinePossible(value, numbers[index][0], numbers[index], 1)) {
            total += value;
        }
    });
    console.log(total);
})