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
          username: props.username,
          password: props.password,
          match_err: false
        }
    }

//     fetchData(app){
//       fetch('/api/auth/login', {
//        method: "POST",
//        dataType: "JSON",
//        headers: {
//          "Content-Type": "application/json; charset=utf-8",
//        },
//        body: JSON.stringify({"username": this.state.username, "password": this.state.password})
//      })
//      .then((resp) => {
//        this.setState({match_err: false});
//        if  (resp.status === 200){
//          app.setState({page:"Game", username:this.state.username, password: this.state.password});
//        }else if (resp.status === 409){
//          this.setState({match_err: true});
//        }
//        console.log(resp.status);
//        return resp.json()
//      }) 
//      .catch((error) => {
//        console.log(error, "catch the hoop")
//      })
//    }

//     handleOnChangeusername = event => {
//       this.setState({username: event.target.value});
//     };

//     handleOnChangepassword= event => {
//       this.setState({password: event.target.value});
//     };

    render() {
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