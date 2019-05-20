import crypto from "crypto";

const DEFAULT_LENGTH = 12;
const MIN_CHAR_TYPE_COUNT = 2;

const hash = (content, host, encode) => {
  let ans = content;

  if (crypto) {
    const h = crypto.createHash("sha256");
    h.update(content);
    h.update(host);

    if (!encode) {
      ans = h.digest().toString("base64");
    } else {
      ans = h.digest(encode);
    }
  }

  return ans;
};

const condense = password => {
  if (!password) {
    return "";
  }

  if (password.length <= DEFAULT_LENGTH) {
    return password;
  }

  let doneCount = 0;
  let pos = new Array(4);

  for (let i = 0; i < password.length; i++) {
    let ch = password.charCodeAt(i);
    if (
      (!pos[0] || pos[0].length < MIN_CHAR_TYPE_COUNT) &&
      ch >= 48 &&
      ch <= 57
    ) {
      // a number
      if (!pos[0]) {
        pos[0] = [i];
      } else {
        pos[0].push(i);
      }

      doneCount++;
    } else if (
      (!pos[1] || pos[1].length < MIN_CHAR_TYPE_COUNT) &&
      ch >= 65 &&
      ch <= 90
    ) {
      // a upper case
      if (!pos[1]) {
        pos[1] = i;
      } else {
        pos[1].push(i);
      }

      doneCount++;
    } else if (
      (!pos[2] || pos[2].length < MIN_CHAR_TYPE_COUNT) &&
      ch >= 97 &&
      ch <= 122
    ) {
      // a lower case
      if (!pos[2]) {
        pos[2] = i;
      } else {
        pos[2].push(i);
      }

      doneCount++;
    } else if (!pos[3] || pos[3].length < MIN_CHAR_TYPE_COUNT) {
      // a symbol
      if (!pos[3]) {
        pos[3] = i;
      } else {
        pos[3].push(i);
      }

      doneCount++;
    }

    if (doneCount === 4 * MIN_CHAR_TYPE_COUNT) {
      break;
    }
  }

  pos = pos.flat();
  let fmt = new Array(DEFAULT_LENGTH);

  for (let loc of pos) {
    let count = 0;
    let idx = loc;

    do {
      idx = (loc + count++) % DEFAULT_LENGTH;
    } while (fmt[idx]);

    fmt[idx] = password.charAt(loc);
  }

  let lastCh = "";
  for (let i = 0; i < DEFAULT_LENGTH; i++) {
    if (fmt[i]) {
      continue;
    }

    fmt[i] = password.charAt(i);
    if (fmt[i] === lastCh) {
      fmt[i] = password.charAt(DEFAULT_LENGTH - i - 1);
    }

    lastCh = fmt[i];
  }

  //TODO: before join, make sure we've at least 1 symbol
  //      use existing char mapping to solve this.

  return fmt.join("");
};

export default {
  install: function(Vue) {
    // Do stuff
    Object.defineProperty(Vue.prototype, "$algo", {
      value: { condense, hash }
    });
  }
};
