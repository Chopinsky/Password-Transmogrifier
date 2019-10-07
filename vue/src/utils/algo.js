import crypto from "crypto";

const MIN_LENGTH = 12;
const MOD = 34;
const OFFSET = 93;
const ENCODE = "ascii";

let outputSize = MIN_LENGTH;

const hash = (content, host, user, encode) => {
  let ans = content;

  if (crypto) {
    const h = crypto.createHash("sha256");
    h.update(content);
    h.update(host);

    if (user) {
      h.update(user);
    }

    if (!encode) {
      ans = h.digest().toString("base64");
    } else {
      ans = h.digest(encode);
    }
  }

  return ans;
};

const hash2 = (content, host, user) => {
  let ans = content;

  if (crypto) {
    const h = crypto.createHash("sha256");
    h.update(content);
    h.update(host);

    if (user) {
      h.update(user);
    }

    ans = h.digest();
  }

  return transform(ans.toString(ENCODE));
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
};

const setOutputSize = size => {
  if (size >= MIN_LENGTH) {
    outputSize = size;
  }
};

const condense = password => {
  if (!password) {
    return "";
  }

  if (password.length <= outputSize) {
    return password;
  }

  let pos = [[], [], [], []];

  //TODO: trim the longest arraies to match the final length requirements

  for (let i = 0; i < password.length; i++) {
    let ch = password.charCodeAt(i);

    if (ch >= 48 && ch <= 57) {
      // a number
      pos[0].push(i);
    } else if (ch >= 65 && ch <= 90) {
      // a upper case
      pos[1].push(i);
    } else if (ch >= 97 && ch <= 122) {
      // a lower case
      pos[2].push(i);
    } else {
      // a symbol
      pos[3].push(i);
    }
  }

  if (pos[0].length === 0) {
    password = update(password, pos, true);
  }

  if (pos[3].length === 0) {
    password = update(password, pos, false);
  }

  pos = pos.flat();
  let final = new Array(outputSize);

  for (let loc of pos) {
    let count = 0;
    let idx = loc;

    do {
      // keep shifting to the next available pos for the
      // chars
      idx = (loc + count++) % outputSize;
    } while (final[idx]);

    final[idx] = password.charAt(loc);
  }

  let lastCh = "";
  for (let i = 0; i < outputSize; i++) {
    if (final[i]) {
      continue;
    }

    final[i] = password.charAt(i);
    if (final[i] === lastCh) {
      final[i] = password.charAt(outputSize - i - 1);
    }

    lastCh = final[i];
  }

  return final.join("");
};

const update = (password, pos, isNum) => {
  // replace with symbols
  let loc;
  let newChar;

  if (pos[1].length > pos[2].length) {
    loc = pos[1].pop();
  } else {
    loc = pos[2].pop();
  }

  if (isNum) {
    // to number
    newChar = mapCharToNum(password.charCodeAt(loc));
    pos[0] = [loc];
  } else {
    // to symbol
    newChar = mapCharToSym(password.charCodeAt(loc));
    pos[3] = [loc];
  }

  password = password.substring(0, loc) + newChar + password.substring(loc + 1);

  return password;
};

const mapCharToNum = charCode => {
  return String.fromCharCode((charCode % 10) + 48);
};

const mapCharToSym = charCode => {
  let pos = charCode % 32;
  let result;

  if (pos < 15) {
    result = pos + 33;
  } else if (pos < 22) {
    result = pos - 15 + 58;
  } else if (pos < 28) {
    result = pos - 22 + 91;
  } else {
    result = pos - 28 + 123;
  }

  return String.fromCharCode(result);
};

export default {
  install: function(Vue) {
    // Do stuff
    Object.defineProperty(Vue.prototype, "$algo", {
      value: { condense, hash, hash2, setOutputSize }
    });
  }
};
