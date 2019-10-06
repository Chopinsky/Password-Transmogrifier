import crypto from "crypto";

const MIN_LENGTH = 12;
const MIN_CHAR_TYPE_COUNT = 2;
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

  let doneCount = 0;
  let pos = new Array(4);

  //TODO: trim the longest arraies to match the final length requirements

  for (let i = 0; i < password.length; i++) {
    let ch = password.charCodeAt(i);

    if (ch >= 48 && ch <= 57) {
      // a number
      if (!pos[0]) {
        pos[0] = [i];
        doneCount++;
      } else if (pos[0].length < MIN_CHAR_TYPE_COUNT) {
        pos[0].push(i);
        doneCount++;
      }
    } else if (ch >= 65 && ch <= 90) {
      // a upper case
      if (!pos[1]) {
        pos[1] = [i];
        doneCount++;
      } else if (pos[1].length < MIN_CHAR_TYPE_COUNT) {
        pos[1].push(i);
        doneCount++;
      }
    } else if (ch >= 97 && ch <= 122) {
      // a lower case
      if (!pos[2]) {
        pos[2] = [i];
        doneCount++;
      } else if (pos[2].length < MIN_CHAR_TYPE_COUNT) {
        pos[2].push(i);
        doneCount++;
      }
    } else {
      // a symbol
      if (!pos[3]) {
        pos[3] = [i];
        doneCount++;
      } else if (pos[3].length < MIN_CHAR_TYPE_COUNT) {
        pos[3].push(i);
        doneCount++;
      }
    }

    if (doneCount === 4 * MIN_CHAR_TYPE_COUNT) {
      break;
    }
  }

  if (!pos[3] || pos[3].length === 0) {
    // replace with symbols
    let transform = -1;
    for (let i = 1; i < 3; i++) {
      if (pos[i] && pos[i].length > 1) {
        transform = pos[i].pop();
        break;
      }
    }

    if (transform >= 0) {
      let newChar = mapChar(password.charCodeAt(transform));
      pos[3] = [transform];
      password =
        password.substring(0, transform) +
        newChar +
        password.substring(transform + 1);
    }
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

const mapChar = charCode => {
  let pos = charCode % 32;
  let result = charCode;

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
