import React, { Component } from "react";
import icon from "./logo.png";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import bcrypt from "bcrypt";

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
  },
  icon: {
    display: "block",
    margin: "auto",
    height: "150px",
    width: "150px"
  }
};

class App extends Component {
  state = {
    password: "",
    hash: "[Enter your password to start]",
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

    bcrypt.hash(password, 5, (err, hash) => {
      if (!err) {
        this.setState({
          password,
          hash,
          entered: true
        });
      }
    });
  };

  handleButtonClick = event => {
    if (this.state.entered && this.textInput) {
      this.textInput.select();
      document.execCommand("copy");
      alert(`Text copied: ${this.state.hash}`);
    }
  };

  render() {
    return (
      <div>
        <img src={icon} style={styles.icon} alt="icon" />
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
              {this.state.hash}
            </Button>
            <input
              type="text"
              ref={this.setTextInputRef}
              value={this.state.hash}
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
