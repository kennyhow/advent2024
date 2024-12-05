const fs = require("fs");

fs.readFile("input.txt", "utf-8", (_, data) => {
  lines = data.trim().split("\n");

  const parse_into_tuple = (x) => {
    x = x.trim().split(/\s+/);
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

  right_freq = new Map();
  right_col.forEach((element) => {
    right_freq.set(element, right_freq.has(element) ? right_freq.get(element) + 1 : 1);
  });
  console.log(right_freq);

  ans = 0;
  left_col.forEach((element) => {
    ans += right_freq.has(element) ? element * right_freq.get(element) : 0;
  });
  console.log(ans);
});
