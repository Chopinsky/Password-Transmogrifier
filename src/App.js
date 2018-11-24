import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";

const styles = {
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class App extends Component {
  state = {
    password: "",
    transmog: "[Enter your password to start]",
    entered: false
  };

  textInput = null;

  setTextInputRef = element => {
    this.textInput = element;
  };

  handleChange = event => {
    if (!event || !event.target) {
      return;
    }

    let password = event.target.value;
    this.setState({
      password,
      transmog: btoa(password),
      entered: true
    });
  };

  handleButtonClick = event => {
    if (this.state.entered && this.textInput) {
      this.textInput.select();
      document.execCommand("copy");
      alert(`Text copied: ${this.state.transmog}`);
    }
  };

  render() {
    return (
      <div>
        <Card className={styles.card}>
          <CardContent>
            <Typography
              className={styles.title}
              color="textSecondary"
              gutterBottom
            >
              Click button to copy the transformed password.
            </Typography>
            <Input
              type="text"
              title="Enter your ordinary password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </CardContent>
          <CardActions>
            <Button size="medium" onClick={this.handleButtonClick}>
              {this.state.transmog}
            </Button>
            <input
              type="text"
              ref={this.setTextInputRef}
              value={this.state.transmog}
              readOnly={true}
              onClick={this.handleButtonClick}
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default App;
