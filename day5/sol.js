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

const buildMatrix = (rules, input) => {
    let matrix = new Array(100).fill(0).map(() => new Array(100).fill(-1));
    rules.forEach(([a, b]) => {
        matrix[a][b] = true;
        matrix[b][a] = false;
    });

    let change = true;
    while(change) {
        change = false;
        input.forEach((a) => {
            input.forEach((b) => {
                input.forEach((c) => {
                    if (matrix[a][b] == true && matrix[b][c] == true && matrix[a][c] == -1) {
                        matrix[a][c] = true;
                        matrix[c][a] = false;
                        change = true;
                    }
                    if (matrix[a][b] == false && matrix[b][c] == false && matrix[a][c] == -1) {
                        matrix[a][c] = false;
                        matrix[c][a] = true;
                        change = true;
                    }
                })
            })
        });
    }

    input.forEach((a) => {
        input.forEach((b) => {
            console.log(`a: ${a}, b: ${b}, result: ${matrix[a][b] == -1 ? "invalid" : (matrix[a][b] == true ? " (a, b) " : " (b, a) ")}`);
        });
    });
    console.log();
    return matrix;
};

const fixInput = (rules, input) => {
    let elements = new Set(input);
    rules = rules.filter(([a, b]) => {
        return elements.has(a) && elements.has(b);
    });
    console.log(`rules is ${JSON.stringify(rules)} and input is ${input}`);

    let matrix = buildMatrix(rules, input.slice());
    input.sort((a, b) => matrix[a][b] == true ? -1 : (matrix[a][b] == false ? 1 : 0));
    return input;
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

    let invalid = inputs.map((input) => {
        let result = isValid(rules, input);
        if (result) {
            return 0;
        }
        else {
            let fixed = fixInput(rules, input);
            return fixed[Math.floor(fixed.length / 2)];
        }
    });
    console.log(invalid);
    console.log(invalid.reduce((acc, current) => acc + current));
});