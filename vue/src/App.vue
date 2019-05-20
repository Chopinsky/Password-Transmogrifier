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
            v-on:input="onInputChanged"
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
const INPUT_KEY = "hintPhrase";
const TO_SAVE_KEY = "savePassPhrase";
const DEV_MODE = false;

export default {
  name: "app",
  data: function() {
    if (DEV_MODE && chrome && chrome.storage) {
      chrome.storage.sync.get([INPUT_KEY, TO_SAVE_KEY], function(result) {
        if (result[TO_SAVE_KEY]) {
          this.checked = true;
          this.input = result[INPUT_KEY];
          this.setPassword(this.hash(result[INPUT_KEY]));

          this.$refs["input"].focus();
        }
      });
    } else if (typeof Storage !== "undefined") {
      setTimeout(() => {
        if (localStorage[TO_SAVE_KEY] && localStorage[INPUT_KEY]) {
          this.checked = true;
          this.input = localStorage[INPUT_KEY];
          this.setPassword(this.hash(localStorage[INPUT_KEY]));

          this.$refs["input"].focus();
        }
      }, 0);
    }

    let host = window.location.host || window.location.hostname;
    let hostArray = host.split(".");
    if (hostArray.length > 3) {
      host = hostArray.slice(hostArray.length - 3).join(".");
    }

    return {
      host,
      input: "",
      password: "",
      checked: false
    };
  },
  methods: {
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
    updateStore() {
      if (DEV_MODE && chrome && chrome.storage) {
        chrome.storage.sync.set({ key: value }, function() {
          console.log(`Settings {${key}: ${value}} is saved`);
        });
      } else if (typeof Storage !== "undefined") {
        if (this.checked) {
          localStorage[INPUT_KEY] = this.input;
          localStorage[TO_SAVE_KEY] = this.input ? true : false;
        } else {
          localStorage[INPUT_KEY] = "";
          localStorage[TO_SAVE_KEY] = false;
        }
      }
    },
    onInputChanged(event) {
      const currInput = event.target.value;

      if (this.input) {
        let raw = this.$algo.hash(this.input, this.host);
        this.setPassword(this.$algo.condense(raw));
      } else {
        this.setPassword("");
      }

      this.updateStore();
    },
    onButtonClick() {
      this.input = "";
      this.setPassword("");
      this.updateStore();
    },
    onCheckboxClicked(event) {
      this.checked = !this.checked;
      this.updateStore();
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
  min-width: 480px;
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
  width: 360px;
  max-width: 480px;
  min-width: 320px;
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
