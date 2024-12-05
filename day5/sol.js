const fs = require('fs');

const isValid = (rules, input) => {
    let indexOf = new Map();
    input.forEach((value, index) => {
        indexOf.set(value, index);
    });

    var result = true;
    rules.forEach(([a, b]) => {
        if (!indexOf.has(a) || !indexOf.has(b)) return;
        // console.log(`a is ${a} and b is ${b}`);
        // console.log(`their indexes are ${indexOf.get(a)} and ${indexOf.get(b)} respectively`);
        if (indexOf.get(a) > indexOf.get(b)) {
            result = false;
        }
    });
    return result;
};

fs.readFile('input.txt', 'utf-8', (_, data) => {
    data = data.trim().split('\n');
    let rules = [];
    let inputs = [];
    data.forEach((element) => {
        if (element.includes('|')) {
            element = element.split('|');
            element = element.map(Number);
            rules.push(element);
        }
        else if (element.includes(',')) {
            element = element.split(',');
            element = element.map(Number);
            inputs.push(element);
        }
    });

    console.log(`inputs is ${inputs[0]}`);

    let valid = inputs.map((input) => {
        let result = isValid(rules, input);
        if (result) {
            return input[Math.floor(input.length / 2)];
        }
        else {
            console.log("FALSE");
            return 0;
        }
    });
    console.log(valid);
    console.log(valid.reduce((acc, total) => acc + total));
});