<template>
  <div id="app" class="card medium card-custom">
    <div class="card-content">
      <div class="row">
        <span class="card-title grey-text text-darken-2">Pass . Made . Easy</span>
      </div>
      <div class="row fieldRow">
        <div class="input-field col s9">
          <input id="hint" type="text" class="validate" v-model="input" v-on:keyup="onInput">
          <label for="hint">Hint Phrase</label>
        </div>
        <div class="col s3">
          <a class="waves-effect waves-teal btn-flat button">Clear</a>
        </div>
      </div>
      <div class="row fieldRow">
        <div class="input-field col s12">
          <textarea id="password" class="materialize-textarea"/>
          <label for="password">Generated Password</label>
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
      input: ""
    };
  },
  methods: {
    onInput(msg, event) {
      console.log("input...", this.input);
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
}
.card-custom {
  margin: 10px auto;
  width: 100%;
  max-width: 512px;
}
.fieldRow {
  padding: 0 20px;
}
.button {
  margin-top: 18px;
  width: 80px;
  height: 40px;
  padding-top: 0;
  padding-bottom: 4px;
  border: #f9a825 solid 2px;
}
</style>
