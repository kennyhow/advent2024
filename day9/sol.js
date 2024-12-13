const fs = require('fs');
fs.readFile('input.txt', 'utf-8', (_, data) => {
    data = data.trim();
    data = Array.from(data).map((x) => Number(x))

    let disk = [];
    data.forEach((value, index) => {
        if (index % 2 == 1) {
            disk = disk.concat(Array(value).fill(-1))
        }
        else {
            disk = disk.concat(Array(value).fill(Math.floor(index / 2)))
        }
    })
    

    let total = 0;
    for(let i = 0, j = disk.length - 1; i <= j; ) {
        while(j > i && disk[j] == -1) {
            j -= 1;
        }
        if (disk[j] == -1) break;

        while(i < j && disk[i] !== -1) {
            i += 1;
        }
        if (disk[i] !== -1) break;
        if (i == j) break;

        [disk[i], disk[j]] = [disk[j], disk[i]];
        i += 1;
        j -= 1;
    }

    const computeChecksum = (disk) => {
        let total = 0;
        disk.forEach((value, index) => {
            if (value !== -1) {
                total += value * index
            }
        })
        return total;
    }
    
    console.log(computeChecksum(disk))

    class Data {
        constructor(position, length, id) {
            this.position = position;
            this.length = length;
            this.id = id;
        }
    }

    class Space {
        constructor(position, length) {
            this.position = position;
            this.length = length;
        }
    }

    let elems = [], space = [];
    let positionCumulative = 0;
    // console.log(`data is ${data}`)
    data.forEach((value, index) => {
        if (index % 2 == 0) {
            // position = cumSum, length = value, id = index / 2
            elems.push(new Data(positionCumulative, value, Math.floor(index / 2)));
        }
        else {
            // position = cumSum, length = value
            space.push(new Space(positionCumulative, value));
        }

        positionCumulative += value;
    })

    const printElems = (elems) => {
        let grid = new Array(data.length).fill('.');
        elems.forEach((elem) => {
            for(let i = elem.position; i < elem.position + elem.length; i++) {
                grid[i] = elem.id.toString();
            }
        })
    
        console.log(grid.join(''))
    }

    for(let i = elems.length - 1; i >= 0; i--) {
        // printElems(elems)
        for(let j = 0; j < space.length; j++) {
            if (space[j].position > elems[i].position) continue;
            if (space[j].length < elems[i].length) continue;
            
            // move elems[i] to space[j]'s position
            elems[i].position = space[j].position;
            space[j].position += elems[i].length;
            space[j].length -= elems[i].length;
        }
    }



    const computeNewChecksum = (elems) => {
        let total = 0;
        elems.forEach((elem) => {
            for(let i = elem.position; i < elem.position + elem.length; i++) {
                total += i * elem.id;
            }
        })
        return total;
    }
    console.log(computeNewChecksum(elems))
    
})