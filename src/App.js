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
            <Button size="medium">{this.state.transmog}</Button>
          </CardActions>
        </Card>
        <input type="text" value={this.state.transmog} readOnly={true} />
      </div>
    );
  }
}

export default App;
