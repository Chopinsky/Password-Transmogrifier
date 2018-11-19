import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
      <div>
        <Card className={styles.card}>
          <CardContent>
            <Typography
              className={styles.title}
              color="textSecondary"
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant="h5" component="h2">
              benevolent
            </Typography>
            <Typography className={styles.pos} color="textSecondary">
              adjective
            </Typography>
            <Typography component="p">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
        <input
          type="text"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <input type="text" value={this.state.transmog} readOnly={true} />
      </div>
    );
  }
}

export default App;
