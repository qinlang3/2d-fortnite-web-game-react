import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';

// const 

class LoginPage extends React.Component {
    constructor(props){
		super(props);
        this.state = {
          username: props.username,
          password: props.password,
          match_err: false
        }
    }

    // useStyles = makeStyles((theme) => ({
    //   paper: {
    //     marginTop: theme.spacing(8),
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //   },
    //   avatar: {
    //     margin: theme.spacing(1),
    //     backgroundColor: theme.palette.secondary.main,
    //   },
    //   form: {
    //     width: '100%', // Fix IE 11 issue.
    //     marginTop: theme.spacing(1),
    //   },
    //   submit: {
    //     margin: theme.spacing(3, 0, 2),
    //   },
    // }));

    fetchData(app){
      fetch('/api/auth/login', {
       method: "POST",
       dataType: "JSON",
       headers: {
         "Content-Type": "application/json; charset=utf-8",
       },
       body: JSON.stringify({"username": this.state.username, "password": this.state.password})
     })
     .then((resp) => {
       this.setState({match_err: false});
       if  (resp.status === 200){
         app.setState({page:"Game", username:this.state.username, password: this.state.password});
       }else if (resp.status === 409){
         this.setState({match_err: true});
       }
       console.log(resp.status);
       return resp.json()
     }) 
     .catch((error) => {
       console.log(error, "catch the hoop")
     })
   }

    handleOnChangeusername = event => {
      this.setState({username: event.target.value});
    };

    handleOnChangepassword= event => {
      this.setState({password: event.target.value});
    };

    render() {
      const {app} =this.props;
      var localTheme = window.localStorage.getItem('theme');
      var checked = localTheme ? (localTheme === 'dark' ? true : false) : true;
      // const classes = useStyles();
        return (
          <div>
          {this.state.match_err && <Alert severity="error">Username and password does not match!</Alert>}
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
            value={this.state.username}
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
            value={this.state.password}
            autoComplete="current-password"
            onChange={this.handleOnChangepassword}
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => this.fetchData(app)}
          >
            Sign In
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {app.setState({page: "Register"})}}
          >
            Register
          </Button>
          </div>
          );

    }

}

export default LoginPage;