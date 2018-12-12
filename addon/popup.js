function awesome() {
  // Do something awesome!
  console.log("awesome!");
}

function totallyAwesome() {
  // do something TOTALLY awesome!
}

function awesomeTask() {
  awesome();
  totallyAwesome();
}

function clickHandler(e) {
  const crypto = require("crypto");
  const h = crypto.createHash("sha256");
  h.update("what???");
  console.log("clicked...", h.digest().toString("base64"));
  setTimeout(awesomeTask, 1000);
}

function main() {
  // Initialization work goes here.
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("button").addEventListener("click", clickHandler);
  main();
});
