<template>
  <div id="app" class="card medium card-custom">
    <div class="card-content">
      <div class="row title-row">
        <span class="card-title grey-text text-darken-2">Pass . Made . Easy</span>
      </div>
      <div class="row field-row">
        <div class="input-field col s11">
          <input
            id="hint"
            type="text"
            ref="input"
            class="validate"
            v-model="input"
            v-on:keydown="onInputChanged"
          >
          <label for="hint">Hint Phrase</label>
        </div>
        <div class="col s1">
          <a
            class="waves-effect waves-teal btn-flat button"
            title="Clear entrance"
            v-on:click="onButtonClick"
          >
            <i class="material-icons left icon">cancel</i>
          </a>
        </div>
      </div>
      <div class="row inline-row">
        <label class="checkbox">
          <input type="checkbox" v-bind:checked="this.checked" v-on:click="onCheckboxClicked">
          <span>Save this Hint Phrase</span>
        </label>
      </div>
      <div class="row field-row">
        <div class="input-field col s12">
          <textarea
            id="password"
            class="materialize-textarea textarea"
            readonly="readOnly"
            ref="textArea"
            v-model="password"
            v-bind:style="{ fontWeight: 'bold', color: '#1a237e' }"
            v-on:focus="onTextAreaFocus"
            v-on:blur="onTextAreaBlur"
          />
          <label for="password" v-bind:class="isActive">Generated Password</label>
        </div>
      </div>
      <div class="row control-row">
        <a
          class="waves-effect waves-light btn"
          title="Copy the generated password to the clipboard"
          v-bind:disabled="!this.input"
          v-on:click="onCopyClick"
        >
          <i class="material-icons left">content_copy</i>
          Copy to Clipboard
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import crypto from "crypto";

const INPUT_KEY = "hintPhrase";
const TO_SAVE_KEY = "savePassPhrase";

export default {
  name: "app",
  data: function() {
    if (chrome && chrome.storage) {
      input = chrome.storage.sync.get([INPUT_KEY, TO_SAVE_KEY], result => {
        if (result[TO_SAVE_KEY]) {
          this.input = result[INPUT_KEY];
          this.checked = result[TO_SAVE_KEY];
          this.setPassword(this.hash(result[INPUT_KEY]));

          this.$refs["input"].focus();
        }
      });
    }

    return {
      input: "",
      password: "",
      checked: false
    };
  },
  methods: {
    hash(content, encode) {
      let ans = content;
      if (crypto) {
        const h = crypto.createHash("sha256");
        h.update(content);

        if (!encode) {
          ans = h.digest().toString("base64");
        } else {
          ans = h.digest(encode);
        }
      }

      return ans;
    },
    setPassword(password) {
      this.password = password;

      setTimeout(() => {
        M.textareaAutoResize(this.$refs["textArea"]);
      });
    },
    selectCopy() {
      if (this.password && this.$refs["textArea"]) {
        this.$refs["textArea"].select();
        document.execCommand("copy");
      }
    },
    unselect() {
      if (window.getSelection && this.password) {
        if (window.getSelection().empty) {
          // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          // Firefox
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        // IE?
        document.selection.empty();
      }
    },
    store(key, value) {
      if (chrome && chrome.storage) {
        chrome.storage.sync.set({ key: value });
      }
    },
    onInputChanged() {
      this.$nextTick(() => {
        // get input instantly
        if (this.input) {
          this.setPassword(this.hash(this.input));
        } else {
          this.setPassword("");
        }
      });
    },
    onButtonClick() {
      this.input = "";
      this.setPassword("");
    },
    onCheckboxClicked(event) {
      if (chrome) {
        if (this.checked && this.input) {
          this.store(TO_SAVE_KEY, this.input);
        } else {
          this.store(TO_SAVE_KEY, "");
        }
      }
    },
    onCopyClick() {
      this.selectCopy();
      this.unselect();
    },
    onTextAreaFocus() {
      this.selectCopy();
    },
    onTextAreaBlur() {
      this.unselect();
    }
  },
  computed: {
    isActive() {
      return this.input && this.input.length > 0 ? "active" : "";
    }
  }
};
</script>

<style>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: linear-gradient(to right, #fff176, #f9a825);
  width: 100%;
  min-width: 600px;
  overflow: visible;
}
div.row {
  margin-bottom: 0px;
  padding-top: 0px;
}
div.title-row {
  padding: 20px 0 10px 0;
}
div.field-row {
  padding: 0 20px;
}
div.inline-row {
  margin-bottom: 15px;
  padding: 0 32px;
  text-align: left;
}
div.control-row {
  padding: 5px 0;
}
.card-custom {
  margin: 15px auto;
  width: 480px;
  max-width: 512px;
  min-width: 448px;
}
.button {
  margin-top: 24px;
  margin-left: -18px;
  width: 36px;
  height: 36px;
  padding: 0;
}
.button:hover {
  background: silver;
}
i.icon {
  margin: 0;
  padding: 0;
  width: 36px;
}
.textarea::selection {
  color: white;
  background: #34495e;
  text-shadow: 1px 1px 0 #27ae60;
}
</style>
