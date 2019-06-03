const DEV_MODE = true;

const INPUT_KEY = "INPUT_KEY";
const TO_SAVE_KEY = "TO_SAVE_KEY";
const PASSWORD_LEN = "PASSWORD_LEN";

const loadDefault = (default_len, callback) => {
  let checked = false;
  let input = "";
  let passLen = default_len;

  if (DEV_MODE && typeof Storage !== "undefined") {
    setTimeout(() => {
      if (localStorage[TO_SAVE_KEY] && localStorage[INPUT_KEY]) {
        checked = true;
        input = localStorage[INPUT_KEY];
        passLen = localStorage[PASSWORD_LEN] || default_len;

        if (typeof callback === "function") {
          callback({ input, checked, passLen });
        }
      }
    }, 0);
  } else if (chrome && chrome.storage) {
    chrome.storage.sync.get([INPUT_KEY, TO_SAVE_KEY], function(result) {
      if (result[TO_SAVE_KEY]) {
        checked = true;
        input = result[INPUT_KEY];
        passLen = result[PASSWORD_LEN] || default_len;

        if (callback && typeof callback === "function") {
          callback({ input, checked, passLen });
        }
      }
    });
  }
};

const updateStore = val => {
  if (DEV_MODE && typeof Storage !== "undefined") {
    if (this.checked) {
      localStorage[INPUT_KEY] = val;
      localStorage[TO_SAVE_KEY] = val ? true : false;
    } else {
      localStorage[INPUT_KEY] = "";
      localStorage[TO_SAVE_KEY] = false;
    }
  } else if (chrome && chrome.storage) {
    chrome.storage.sync.set({ INPUT_KEY: val }, function() {
      console.info(`Settings {${key} is saved`);
    });
  }
};

export default {
  install: function(Vue) {
    // Do stuff
    Object.defineProperty(Vue.prototype, "$store", {
      value: { loadDefault, updateStore }
    });
  }
};
