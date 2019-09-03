<template>
  <div id="app" class="card large card-custom">
    <div class="card-content">
      <div class="row title-row">
        <span class="card-title grey-text text-darken-2">Password . Made . Easy</span>
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
            title="Clear entrance"
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
            class="validate"
            v-model="host"
            v-on:input="onHostChanged"
          />
          <label for="domain">generated for (can't be empty)</label>
        </div>
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
          <label for="password" v-bind:class="isActive">password</label>
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

      <div class="row short-row">
        <label for="range" class="range-label">
          desired length:
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
        <label class="checkbox">
          <input type="checkbox" v-bind:checked="this.checked" v-on:click="onCheckboxClicked" />
          <span>auto fill for this site</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
const DEFAULT_OUTPUT_LEN = 16;

export default {
  name: "app",
  data: function() {
    let host = this.getHost();

    this.$algo.setOutputSize(DEFAULT_OUTPUT_LEN);
    this.$store.loadDefault(DEFAULT_OUTPUT_LEN, data => {
      if (data && data.input) {
        this.input = data.input;
        this.checked = data.checked;
        this.passLen = data.passLen;

        this.setPassword(data.input, host);
        this.$algo.setOutputSize(data.passLen);
        this.$refs["input"].focus();
      }
    });

    return {
      host,
      input: "",
      password: "",
      passLen: DEFAULT_OUTPUT_LEN,
      checked: false
    };
  },
  methods: {
    getHost() {
      const host = window.location.host || window.location.hostname;

      const hostArray = host.split(".");
      if (hostArray.length > 3) {
        host = hostArray.slice(hostArray.length - 3).join(".");
      }

      return host;
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
label.range-label {
  font-size: 1em;
}
span.range-data {
  font-weight: bold;
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
