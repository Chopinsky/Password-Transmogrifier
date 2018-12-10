import crypto from "crypto";

export default class Cipher {
  constructor(uri) {
    if (uri) {
      this.secret = uri;
    } else {
      this.secret = "127.0.0.1:3000";
    }

    if (crypto) {
      //TODO: create hash instead?
      this.cipher = crypto.createCipher("aes-128-cbc", this.secret);
    }
  }

  update(uri) {
    if (!crypto) {
      return;
    }

    if (uri !== this.secret) {
      this.secret = uri;
      this.cipher = crypto.createCipher("aes-128-cbc", this.secret);
    }
  }

  encrypt(password) {
    if (!crypto) {
      return password;
    }

    this.cipher.update(password, "utf8", "hex");
    console.log(mykey.final("hex"));
  }
}
