import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    password: "",
    transmog: ""
  };

  handleChange = event => {
    if (!event || !event.target) {
      return;
    }

    let password = event.target.value;
    this.setState({
      password,
      transmog: btoa(password)
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <input
            type="text"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input type="text" value={this.state.transmog} readOnly={true} />
        </header>
      </div>
    );
  }
}

export default App;
