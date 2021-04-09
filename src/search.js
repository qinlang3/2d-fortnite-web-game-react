import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Header from './components/header';

// const 

class SearchPage extends React.Component {
    constructor(props){
		super(props);
        this.state = {
          search_name: "",
          search_err: false,
          search_tru: false
        }
    }

    searchname(app){
      let url = '/api/view/search/:';
      url += this.state.search_name + '/';
      console.log(url);
      fetch(url, {
       method: "GET",
       dataType: "JSON",
       headers: {
         "Content-Type": "application/json; charset=utf-8",
       },
     })
     .then((resp) => {
       this.setState({search_err: false, search_tru: false});
       if  (resp.status === 404){
        this.setState({search_err: true});
       }else if (resp.status === 200){
        this.setState({search_tru: true});
       }
       console.log(resp.status);
       return resp.json()
     }) 
     .catch((error) => {
       console.log(error, "catch the hoop")
     })
   }

    handleOnChange = event => {
      this.setState({search_name: event.target.value});
    };

    render() {
      const {app, sections} =this.props;
        return (
          <React.Fragment>
          <CssBaseline/>
          <Container maxWidth="xs">
          <Header app={app} title="2D Fortnite Game" sections={sections}/>
          {this.state.search_tru && <Alert severity="success">This player add to your killlist!</Alert>}
          {this.state.search_err && <Alert severity="error">This username does not exist in our game!</Alert>}
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="search_player"
            label="Search any player, Add them to your killList!"
            id="search_player"
            autoComplete="current-password"
            onChange={this.handleOnChange}
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => this.searchname(app)}
          >
            Search
          </Button>
         
          </Container>
            </React.Fragment>
          );

    }

}

export default SearchPage;