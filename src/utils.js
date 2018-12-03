const hexToBytes = (hex, debug) => {
  if (!hex || typeof hex !== "string" || hex.length === 0) {
    return [0];
  }

  let buf = 0;
  let result = [];

  hex.split("").forEach((char, idx) => {
    let hexNum = mapCharToByte(char.toUpperCase());

    if (debug) {
      console.log(`${char} -> ${hexNum}`);
    }

    switch (idx % 3) {
      case 1:
        let mod = Math.floor(hexNum / 4);
        buf += mod;
        result.push(buf);
        buf = hexNum % 4;
        break;

      case 2:
        buf += hexNum;
        result.push(buf);
        buf = 0;
        break;

      default:
        buf = hexNum * 4;
        break;
    }
  });

  if (buf !== 0) {
    result.push(buf);
  }

  return result;
};

const mapCharToByte = char => {
  if (char >= "0" && char <= "9") {
    return char - "0";
  } else if (char >= "A" && char <= "F") {
    return 10 + char.charCodeAt(0) - 65;
  } else {
    return 0;
  }
};

module.exports = {
  hexToBytes
};
