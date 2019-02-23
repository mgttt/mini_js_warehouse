const gcd2 = (x, y) => (!y ? x : gcd2(y, x % y));

const gcd = (...arr) => {
  let data = [].concat(...arr);
  return data.reduce((a, b) => gcd2(a, b));
};


console.log(gcd(5,[2,4,6,8,10]));
