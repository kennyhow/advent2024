const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (err, data) => {
    let registerRegex = /Register .?: (\d+)/g;
    let registers = [...data.matchAll(registerRegex)].map(x => Number(x[1]));
    let input = data.trim().split('\n');
    input = input[input.length - 1].replace('Program: ', '').split(',').map(Number);
    
    let [A, B, C] = registers;
    let instrPointer = 0;
    let output = [];

    const combo = (n) => {
        if (n <= 3) return n;
        if (n == 4) return A;
        if (n == 5) return B;
        if (n == 6) return C;
        throw new Error("Invalid combo operand");
    }

    const adv = (n) => {
        A = Math.floor(A / (2**combo(n)));
    }

    const bxl = (n) => {
        B ^= n;
    }

    const bst = (n) => {
        B = (combo(n) % 8);
    }

    const jnz = (n) => {
        if (A !== 0) {
            instrPointer = n - 2; // increase by 2 later
        }
    }

    const bxc = (_) => {
        B ^= C;
    }

    const out = (n) => {
        output.push(combo(n) % 8);
    }

    const bdv = (n) => {
        B = Math.floor(A / (2**combo(n)));
    }

    const cdv = (n) => {
        C = Math.floor(A / (2**combo(n)));
    }

    const operations = [
        adv, bxl, bst, jnz, bxc, out, bdv, cdv
    ]

    while(instrPointer + 1 <= input.length) {
        let [a, b] = [input[instrPointer], input[instrPointer + 1]];
        operations[a](b);
        instrPointer += 2;
    }

    console.log(output.join(','));
})