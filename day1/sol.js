const fs = require("fs");

fs.readFile("input.txt", "utf-8", (_, data) => {
  lines = data.trim().split("\n");

  const parse_into_tuple = (x) => {
    x = x.trim().split(/\s+/);
    console.log(x.map(Number));
    return x.map(Number);
  };

  lines = lines.map(parse_into_tuple);

  let left_col = [], right_col = [];
  lines.forEach(element => {
    left_col.push(element[0]);
    right_col.push(element[1]);
  });

  left_col.sort((a, b) => (a - b));
  right_col.sort((a, b) => (a - b));

  let ans = 0;
  left_col.forEach((value, index) => {
    ans += Math.abs(value - right_col[index]);
  });
  console.log(ans);
});
