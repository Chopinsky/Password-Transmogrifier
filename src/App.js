import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import hash from "hash.js";
import crypto from "crypto";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    backgroundColor: "#FFFDE7",
    margin: "10px 70px",
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  textField: {
    minWidth: 250,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      hash: "",
      entered: false
    };
  }

  setTextInputRef = element => {
    this.textInput = element;
  };

  handleChange = event => {
    if (!event || !event.target) {
      return;
    }

    let password = event.target.value;
    let raw = "";

    if (password) {
      //let crypto = require("crypto");
      let mykey = crypto.createCipher("aes-128-cbc", "hashbrown-salt");
      mykey.update(password, "utf8", "hex");
      console.log(mykey.final("hex"));

      raw = hash
        .sha256()
        .update(password)
        .digest("hex");

      let newHash = btoa(raw);

      let result = "";
      for (let i = 0; i < newHash.length; i++) {
        if (i > 0 && i !== newHash.length - 1 && (i + 1) % 4 === 0) {
          result += newHash.charAt(i) + "-";
        } else {
          result += newHash.charAt(i);
        }
      }
    }

    this.setState({
      password,
      hash: raw,
      entered: true
    });
  };

  handleButtonClick = event => {
    if (this.state.entered && this.textInput) {
      this.textInput.select();

      document.execCommand("copy");
      window.getSelection().removeAllRanges();

      console.log(`Text copied: ${this.state.hash}`);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Grid container wrap="nowrap" spacing={16}>
            <Grid item sm={3} xs={1} zeroMinWidth />
            <Grid item sm={6} xs={10}>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Click the generated password field to copy the encoded password
                to the clipboard.
              </Typography>
              <TextField
                required
                fullWidth
                label="Pass-Phrase"
                helperText="The pass-phrase is case sensitive."
                margin="normal"
                variant="outlined"
                value={this.state.password}
                onChange={this.handleChange}
                className={classes.textField}
              />
              <br />
              <TextField
                multiline
                fullWidth
                disabled={this.state.hash.length === 0}
                rows="3"
                label="Generated Password"
                placeholder="Enter your pass-phrase to begin"
                margin="normal"
                variant="outlined"
                inputRef={this.setTextInputRef}
                value={this.state.hash}
                readOnly={true}
                onClick={this.handleButtonClick}
                className={classes.textField}
              />
            </Grid>
            <Grid item sm={3} xs={1} zeroMinWidth />
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(App);
