const fs = require('fs');
const mul = (a, b) => a * b;

fs.readFile('input.txt', 'utf-8', (_, data) => {
    console.log(data);
    let regex = /mul\((\d+),(\d+)\)/g;

    eval("mul(2, 3)");
    
    let matches = data.match(regex);
    matches = matches.map((match) => { // TODO: LEARN MORE ABOUT SCOPE
        return eval(match);
    });
    console.log(matches);
    const sum = matches.reduce((acc, current) => acc + current);
    console.log(sum);

    regex = /(mul\(\d+,\d+\))|(do\(\))|(don\'t\(\))/g;
    matches = data.match(regex);
    console.log(matches);

    let ans = 0, enabled = true;
    matches.forEach((element) => {
        if (element == "do()") {
            enabled = true;
        }
        else if (element == "don't()") {
            enabled = false;
        }
        else {
            ans += enabled ? eval(element) : 0;
        }
    });

    console.log(ans);
});