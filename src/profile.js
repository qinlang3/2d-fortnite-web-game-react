import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './components/header';

// const 

class ProfilePage extends React.Component {
    constructor(props){
		super(props);
        this.state = {
          username: props.username,
          password: props.password,
          confirmpassword: props.password,
          password_err: false,
          empty_err: false,
          update_password: false
        }
    }

    updatepassword(app){
      fetch('/api/authU/update', {
       method: "PUT",
       dataType: "JSON",
       headers: {
         "Content-Type": "application/json; charset=utf-8",
       },
       body: JSON.stringify({"username": this.state.username, "password": this.state.password, "confirmpassword": this.state.confirmpassword})
     })
     .then((resp) => {
       this.setState({password_err: false, empty_err: false, update_password: false});
       if  (resp.status === 200){
         app.setState({page:"Profile", username:this.state.username, password: this.state.password});
         this.setState({update_password: true});
       }else if (resp.status === 400){
         this.setState({password_err: true});
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

   deleteaccount(app){
    fetch('/api/authD/delete', {
     method: "DELETE",
     dataType: "JSON",
     headers: {
       "Content-Type": "application/json; charset=utf-8",
     },
     body: JSON.stringify({"username": this.state.username})
   })
   .then((resp) => {
     this.setState({password_err: false, empty_err: false, update_password: false});
     if  (resp.status === 200){
       app.setState({page:"Login", username:"", password: ""});
     }
     console.log(resp.status);
     return resp.json()
   }) 
   .catch((error) => {
     console.log(error, "catch the hoop")
   })
 }

    handleOnChangepassword = event => {
      this.setState({password: event.target.value});
    };

    handleOnChangeconfirmpassword= event => {
      this.setState({confirmpassword: event.target.value});
    };

    render() {
      const {app, sections} =this.props;
      // const classes = useStyles();
        return (
          <React.Fragment>
          <CssBaseline/>
          <Container maxWidth="xs">
          <Header app={app} title="2D Fortnite Game" sections={sections}/>
          {this.state.update_password && <Alert severity="success">Password change successfully!</Alert>}
          {this.state.password_err && <Alert severity="error">Your two password are not the same!</Alert>}
          {this.state.empty_err && <Alert severity="error">Password can not be empty!</Alert>}
          <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
            label="Username"
            value={this.state.username}
            autoComplete="current-password"
            />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Reset Password"
            label="Reset Password"
            type="password"
            id="password"
            value={this.state.password}
            autoComplete="current-password"
            onChange={this.handleOnChangepassword}
            />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Confirm Password"
            label="Confirm Password"
            type="password"
            id="password"
            value={this.state.confirmpassword}
            autoComplete="current-password"
            onChange={this.handleOnChangeconfirmpassword}
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => this.updatepassword(app)}
          >
            Update Password
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => this.deleteaccount(app)}
          >
            DELETE ACCOUNT
          </Button>
         
          </Container>
            </React.Fragment>
          );

    }

}

export default ProfilePage;