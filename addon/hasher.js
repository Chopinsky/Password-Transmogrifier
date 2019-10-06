const crypto = require("crypto");
const MOD = 34;
const OFFSET = 93;

const hash = (content, host, user, encode) => {
  let ans = content;
  let buf;

  if (crypto) {
    const h = crypto.createHash("sha256");
    h.update(content);
    h.update(host);

    if (user) {
      h.update(user);
    }
    
    ans = h.digest();

    console.log(ans);
  }

  return ans.toString(encode);
};

const transform = buf => {
  if (!buf || buf.length === 0) {
    return buf.toString();
  }

  let res = "";

  for (let i = 0; i < buf.length; i++) {
    let code = buf.charCodeAt(i);

    if (code < 33 || code > 126) {
      code %= MOD;
      code += OFFSET;
    }

    res += String.fromCharCode(code);
  }

  return res;
}

let a = hash("what did you say???", "", "", "ascii");
let b = transform(a);
console.log(b);
console.log(b.length);
