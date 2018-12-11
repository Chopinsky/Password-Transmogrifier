import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { getHash } from "./utils.js";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    backgroundColor: "#FFFDE7",
    margin: "10px 70px",
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    marginTop: 10
  },
  button: {
    margin: theme.spacing.unit,
    width: "100%"
  },
  checkbox: {
    marginLeft: theme.spacing.unit - 10,
    width: "100%"
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
      entered: false,
      cacheHint: false
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
    let result = "";

    if (password) {
      let raw = getHash(password);

      for (let i = 0; i < raw.length; i++) {
        if (i > 0 && i !== raw.length - 1 && (i + 1) % 4 === 0) {
          result += raw.charAt(i) + "-";
        } else {
          result += raw.charAt(i);
        }
      }
    }

    this.setState({
      password,
      hash: result,
      entered: true
    });
  };

  handleCheckboxClick = event => {
    let toCache = !this.state.cacheHint;
    this.setState({
      cacheHint: toCache
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
                align="center"
                className={classes.title}
                color="textSecondary"
              >
                Lorem more blah blah....
              </Typography>
              <TextField
                required
                fullWidth
                label="Pass Phrase"
                helperText="* The pass phrase is case sensitive."
                margin="normal"
                variant="outlined"
                value={this.state.password}
                onChange={this.handleChange}
                className={classes.textField}
              />
              <TextField
                multiline
                fullWidth
                disabled={this.state.hash.length === 0}
                rows="3"
                label="Generated Password"
                placeholder="Enter your pass-phrase to begin"
                helperText="* Click the generated password field to copy the encoded password
                to the clipboard."
                margin="normal"
                variant="outlined"
                inputRef={this.setTextInputRef}
                value={this.state.hash}
                readOnly={true}
                onClick={this.handleButtonClick}
                className={classes.textField}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Copy to clipboard
              </Button>
              <FormControlLabel
                className={classes.checkbox}
                label="Remember this Pass-Phrase next time"
                control={
                  <Checkbox
                    checked={this.state.cacheHint}
                    onChange={this.handleCheckboxClick}
                  />
                }
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
