<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <input v-model="message" v-on:keyup="onInput" placeholder="edit me">
    <p>Message is: {{ message }}</p>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "app",
  data: () => {
    return {
      message: ""
    };
  },
  methods: {
    onInput(msg, event) {
      console.log("input...", this.message);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
