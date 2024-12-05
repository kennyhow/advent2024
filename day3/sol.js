const fs = require('fs');
const mul = (a, b) => a * b;

fs.readFile('input.txt', 'utf-8', (_, data) => {
    console.log(data);
    let regex = /mul\((\d+),(\d+)\)/g;

    eval("mul(2, 3)");
    
    let matches = data.match(regex);
    matches = matches.map((match) => {
        return eval(match);
    });
    console.log(matches);
    const sum = matches.reduce((acc, current) => acc + current);
    console.log(sum);
});