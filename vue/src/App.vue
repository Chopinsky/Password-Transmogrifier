<template>
  <div id="app" class="card large card-custom">
    <div class="card-content">
      <div class="row title-row">
        <span class="card-title grey-text text-darken-1" style="margin-bottom: 0;">Craftsman</span>
        <span class="grey-text">A Password Servant</span>
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
          />
          <label for="hint">hint phrase</label>
        </div>
        <div class="col s1">
          <a
            class="waves-effect waves-teal btn-flat button"
            title="Clear this hint phrase"
            v-on:click="onButtonClick"
          >
            <i class="material-icons left icon">cancel</i>
          </a>
        </div>
      </div>

      <div class="row field-row">
        <div class="input-field col s12">
          <input
            id="domain"
            type="text"
            ref="domain"
            class="active validate"
            v-model="host"
            v-on:input="onHostChanged"
          />
          <label for="domain">for site (can't left empty)</label>
        </div>
      </div>

      <!-- TODO: for user -> chrome.identity.getProfileUserInfo(function callback) -->

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
          <label for="password" v-bind:class="isActive">crafted password</label>
        </div>
      </div>

      <div class="row control-row">
        <a
          class="waves-effect waves-light btn long-btn"
          title="Copy the generated password to the clipboard"
          v-bind:disabled="!this.input"
          v-on:click="onCopyClick"
        >
          <i class="material-icons left">content_copy</i>
          Copy to Clipboard
        </a>
      </div>

      <div class="row short-row">
        <label for="range" class="range-label alt-font">
          with password length:
          <span class="range-data">{{passLen}}</span>
        </label>
        <p id="range">
          <input
            type="range"
            id="pass-len"
            min="12"
            max="32"
            step="4"
            v-model="passLen"
            v-on:change="onRangeChanged"
          />
        </p>
      </div>

      <div class="row inline-row">
        <label class="checkbox alt-font">
          <input type="checkbox" v-bind:checked="this.checked" v-on:click="onCheckboxClicked" />
          <span class>save this hint phrase for all</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
const DEFAULT_OUTPUT_LEN = 16;
const HOST_UNAVAILABLE = "<current page info unavailable>";

export default {
  name: "app",
  data: function() {
    this.getHost(host => {
      if (host) {
        this.host = host;
      }
    });

    this.$algo.setOutputSize(DEFAULT_OUTPUT_LEN);

    this.$store.loadDefault(DEFAULT_OUTPUT_LEN, data => {
      if (data && data.input) {
        this.input = data.input;
        this.checked = data.checked;
        this.passLen = data.passLen;

        this.setPassword(data.input, host);
        this.$algo.setOutputSize(data.passLen);
      }
    });

    return {
      host:
        window.location.host || window.location.hostname || HOST_UNAVAILABLE,
      input: "",
      password: "",
      passLen: DEFAULT_OUTPUT_LEN,
      checked: false
    };
  },
  mounted: function() {
    // make sure all input fields' labels are properly moved
    M.updateTextFields();

    // set initial focus to the input field
    this.$nextTick(function() {
      this.$refs["input"].focus();
    });
  },
  methods: {
    getHost(cb) {
      if (chrome && chrome.tabs) {
        const query = {
          active: true,
          lastFocusedWindow: true
        };

        chrome.tabs.query(query, tabs => {
          let host = tabs[0].url;
          let raw = host.split("/");

          for (const val of raw) {
            if (val && !val.endsWith(":")) {
              let ary = val.split(".");
              host = ary.slice(ary.length > 3 ? ary.length - 3 : 0).join(".");
              break;
            }
          }

          cb(host);
        });
      }
    },
    setPassword(password, host) {
      if (password) {
        let raw = this.$algo.hash(password, host || this.host);
        this.password = this.$algo.condense(raw);
      } else {
        this.password = "";
      }

      setTimeout(() => {
        M.textareaAutoResize(this.$refs["textArea"]);
      });
    },
    selectCopy() {
      if (this.password && this.$refs["textArea"]) {
        this.$refs["textArea"].select();
        document.execCommand("copy");

        //todo: also store if not the same input
      }
    },
    unselect() {
      if (window.getSelection && this.password) {
        let selection = window.getSelection();

        if (selection.empty) {
          // Chrome
          selection.empty();
        } else if (selection.removeAllRanges) {
          // Firefox
          selection.removeAllRanges();
        }
      } else if (document.selection) {
        // IE?
        document.selection.empty();
      }
    },
    updateStore(val) {
      this.$store.updateStore(val, this.checked);
    },
    onInputChanged(event) {
      const currInput = event.target.value;

      this.setPassword(currInput);
      this.updateStore(currInput);
    },
    onHostChanged(event) {
      const alteredHost = event.target.value;

      if (!alteredHost) {
        this.host = this.getHost();
      }

      if (this.input) {
        this.setPassword(this.input);
      }
    },
    onButtonClick(event) {
      this.input = "";
      this.setPassword("");
      this.updateStore("");
    },
    onCheckboxClicked(event) {
      this.checked = !this.checked;
      this.updateStore(this.input);
    },
    onRangeChanged(event) {
      const currRange = event.target.value;
      console.log(currRange);

      this.$algo.setOutputSize(currRange);
      if (this.input) {
        this.setPassword(this.input);
      }
    },
    onCopyClick(event) {
      this.selectCopy();
      this.unselect();
    },
    onTextAreaFocus(event) {
      this.selectCopy();
    },
    onTextAreaBlur(event) {
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
  font-family: monospace, Helvetica, Arial, sans-serif;
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
  padding: 8px 0 16px 0;
}
div.field-row {
  padding: 0 20px;
}
div.short-row {
  padding: 5px 45px 15px 45px;
  text-align: left;
}
div.inline-row {
  margin-bottom: 12px;
  margin-top: -8px;
  padding: 0 45px;
  text-align: left;
}
div.control-row {
  padding: 0 0 5px 0;
  margin-bottom: 12px;
}
div.card-custom#app {
  margin: 15px auto;
  height: 540px;
  width: 360px;
  max-width: 480px;
  min-width: 320px;
}
a.long-btn {
  padding: 0 26px;
}
label.alt-font {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}
label.range-label {
  font-size: 1em;
}
span.range-data {
  font-weight: 600;
  color: #1a237e;
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
