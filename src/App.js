import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import icon from "./logo.png";
import hash from "hash.js";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  icon: {
    display: "block",
    margin: "auto",
    width: 64,
    height: 64
  },
  textField: {
    width: 250,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

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
    let raw = hash
      .sha256()
      .update(password)
      .digest();

    let newHash = btoa(raw);

    let result = "";
    for (let i = 0; i < newHash.length; i++) {
      if (i > 0 && i !== newHash.length - 1 && (i + 1) % 4 === 0) {
        result += newHash.charAt(i) + "-";
      } else {
        result += newHash.charAt(i);
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
        <Paper className={classes.root}>
          <Grid container wrap="nowrap" spacing={16}>
            <Grid item>
              <img src={icon} className={classes.icon} alt="icon" />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                Click new password field to copy the encoded password to the
                clipboard.
              </Typography>
              <TextField
                required
                fullWidth
                label="Master Password"
                helperText="Enter your master password for encoding"
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
                rowsMax="6"
                label="Encoded Result"
                margin="normal"
                variant="outlined"
                inputRef={this.setTextInputRef}
                value={this.state.hash}
                readOnly={true}
                onClick={this.handleButtonClick}
                className={classes.textField}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(App);
