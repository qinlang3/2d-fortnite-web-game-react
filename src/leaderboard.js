import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './components/header';

// const 

class Leaderboard extends React.Component {
    constructor(props){
		super(props);
        this.state = {
          top10player: props.top10player
        }
    }

    render() {
      console.log(this.state.top10player);
      const {app, sections} =this.props;
      // const classes = useStyles();
        return (
          <React.Fragment>
          <CssBaseline/>
          <Container maxWidth="xs">
          <Header app={app} title="2D Fortnite Game" sections={sections}/>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus />
          </Container>
            </React.Fragment>
          );

    }

}

export default Leaderboard;