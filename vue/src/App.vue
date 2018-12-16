<template>
  <div id="app" class="card medium card-custom">
    <div class="card-content">
      <div class="row">
        <span class="card-title grey-text text-darken-2">Pass . Made . Easy</span>
      </div>
      <div class="row fieldRow">
        <div class="input-field col s9">
          <input id="hint" type="text" class="validate" v-model="input" v-on:keyup="onInputChanged">
          <label for="hint">Hint Phrase</label>
        </div>
        <div class="col s3">
          <a class="waves-effect waves-teal btn-flat button">
            <i class="material-icons left icon">cancel</i>Clear
          </a>
        </div>
      </div>
      <div class="row fieldRow">
        <div class="input-field col s12">
          <textarea
            id="password"
            class="materialize-textarea"
            readonly="readOnly"
            ref="textArea"
            v-model="password"
            v-on:focus="onTextAreaFocus"
            v-on:blur="onTextAreaBlur"
          />
          <label for="password" v-bind:class="isActive">Generated Password</label>
        </div>
      </div>
      <div class="row">
        <p>Message is: {{ input }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "app",
  data: () => {
    return {
      input: "",
      password: ""
    };
  },
  methods: {
    onInputChanged() {
      if (this.input) {
        this.password = this.input;
      } else {
        this.password = "";
      }
    },
    onTextAreaFocus() {
      this.$refs["textArea"].select();
    },
    onTextAreaBlur() {
      if (window.getSelection) {
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
  min-width: 600px;
  overflow: visible;
}
.card-custom {
  margin: 10px auto;
  width: 100%;
  max-width: 512px;
  min-width: 448px;
}
.fieldRow {
  padding: 0 20px;
}
.button {
  margin-top: 18px;
  width: 90px;
  height: 40px;
  padding: 0 4px 5px 7px;
  border: #f9a825 solid 2px;
}
i.icon {
  margin: 0;
  padding: 0;
  width: 20px;
}
</style>
