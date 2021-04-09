import React from 'react';

import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './components/header';


class RegisterPage extends React.Component {
    constructor(props){
      super(props);
        this.state = {
            password_err : false,
            username_err : false,
            empty_err: false,
            go_to_loginpage: false,
            username : "",
            password : "",
            confirm_password : ""
        }
    }

    handleOnChangeusername = event => {
      this.setState({username: event.target.value})
    };

    handleOnChangepassword= event => {
      this.setState({password: event.target.value})
    };

    handleOnChangeconfirmpassword= event => {
      this.setState({confirm_password: event.target.value})
    };

     fetchData(app){
       fetch('/api/authR/register', {
        method: "POST",
        dataType: "JSON",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({"username": this.state.username, "password": this.state.password, "confirmpassword": this.state.confirm_password})
      })
      .then((resp) => {
        this.setState({password_err:false, username_err: false, empty_err: false});
        if  (resp.status === 200){
          app.setState({page:"Login", username:this.state.username, password: this.state.password});
        }else if (resp.status === 400){
          this.setState({password_err:true});
        }else if (resp.status === 409){
          this.setState({username_err: true});
        }else if (resp.status === 401){
          this.setState({empty_err: true});
        }
        console.log(resp.status);
        return resp.json()
      }) 
      .catch((error) => {
        console.log(error, "catch the hoop")
      })
    }
  
    render() {
      const {app} =this.props;
        // const classes = useStyles();
        return (
          <React.Fragment>
          <CssBaseline/>
          <Container maxWidth="xs">
          <Header app={app} title="2D Fortnite Game" sections={null}/>
          
            {this.state.empty_err && <Alert severity="error">All the registration field can not be empty!</Alert>}
            {this.state.password_err && <Alert severity="error">Your two password are not the same!</Alert>}
            {this.state.username_err && <Alert severity="error">This username has been used!</Alert>}
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={this.handleOnChangeusername}
            autoFocus />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={this.handleOnChangepassword}
            />
             <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmpassword"
            label="confirmPassword"
            type="password"
            id="confirmpassword"
            autoComplete="current-password"
            onChange={this.handleOnChangeconfirmpassword}
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => this.fetchData(app)}
          >
            Register
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {app.setState({page: "Login"})}}
          >
            Go back to Login Page
          </Button>
          </Container>
          </React.Fragment>

          );

    }

}

export default RegisterPage;