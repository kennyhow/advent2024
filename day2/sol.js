const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (_, data) => {
    let reports = data.trim().split('\n');

    const parse_to_array = (string) => {
        string = string.trim().split(/\s+/);
        string = string.map(Number);
        return string;
    };

    reports = reports.map(parse_to_array);

   // reports = [[9, 7, 6, 2, 1]];
    
    const is_safe = (line) => {
        let sorted_line = line.slice().sort((a, b) => (a - b));
        let unsorted_line = sorted_line.slice().reverse();


        if (!(JSON.stringify(line) == JSON.stringify(sorted_line)) && !(JSON.stringify(line) == JSON.stringify(unsorted_line))) {
            return false;
        }


        for(let i = 0; i < line.length - 1; i++) {
            let dist = Math.abs(line[i] - line[i + 1]);
            if (dist < 1 || dist > 3) return false;
        }
        //console.log(`returning safe for ${line}`);
        return true;
    };

    const is_meta_safe = (line) => {
        let res = is_safe(line);

        for(let i = 0; i < line.length; i++) {
            let line_copy = [...line.slice(0, i), ...line.slice(i + 1)];
            res |= is_safe(line_copy);
        }
        return res;
    };

    reports = reports.map(is_meta_safe);
    console.log(reports.filter(x => (x)).length);
});