import React from 'react';

import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';

import Switch from '@material-ui/core/Switch';
class RegisterPage extends React.Component {
    constructor(props){
      super(props);
        this.state = {
            password_err : false,
            username_err : false,
            empty_err: false,
            go_to_loginpage: false
        }
        this.username = "";
        this.password = "";
        this.confirm_password = "";
    }

    handleOnChangeusername = event => {
      this.username = event.target.value;
    };

    handleOnChangepassword= event => {
      this.password = event.target.value;
    };

    handleOnChangeconfirmpassword= event => {
      this.confirm_password = event.target.value;
    };

     fetchData(app){
       fetch('/api/authR/register', {
        method: "POST",
        dataType: "JSON",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({"username": this.username, "password": this.password, "confirmpassword": this.confirm_password})
      })
      .then((resp) => {
        this.setState({password_err:false, username_err: false, empty_err: false});
        if  (resp.status === 200){
          app.setState({page:"Login", username:this.username, password: this.password});
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
      var localTheme = window.localStorage.getItem('theme');
      var checked = localTheme ? (localTheme === 'dark' ? true : false) : true;
        // const classes = useStyles();
        return (
          <div>
            {this.state.empty_err && <Alert severity="error">All the registration field can not be empty!</Alert>}
            {this.state.password_err && <Alert severity="error">Your two password are not the same!</Alert>}
            {this.state.username_err && <Alert severity="error">This username has been used!</Alert>}
          <Switch
          checked={checked}
          onChange={app.toggleTheme}
          color="primary"
        />
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
          </div>
          );

    }

}

export default RegisterPage;