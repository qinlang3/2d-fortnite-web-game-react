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
          search_tru: false,
          top10player: []
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


async fetchTop10player(){
  const url = '/api/view/getTop10player';
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  console.log(data.success);
  this.setState({top10player: data.success});
}

    handleOnChange = event => {
      this.setState({search_name: event.target.value});
    };

    render() {
      console.log(this.state.top10player);
      console.log(this.state.top10player.length);
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

                      <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => this.fetchTop10player()}
          >
            See Top 10 Player
          </Button>
          <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
        
            value={this.state.top10player.length < 1 ? "" : "top0 player: " + this.state.top10player[0].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
       
            value={ this.state.top10player.length < 2 ? "" : "top1 player: " + this.state.top10player[1].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
       
            value={ this.state.top10player.length < 3 ? "" : "top2 player: " + this.state.top10player[2].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
        
            value={ this.state.top10player.length < 4 ? "" : "top3 player: " + this.state.top10player[3].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
          
            value={this.state.top10player.length < 5 ? "" : "top4 player: " + this.state.top10player[4].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
      
            value={ this.state.top10player.length < 6 ? "" : "top5 player: " + this.state.top10player[5].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
       
            value={ this.state.top10player.length < 7 ? "" : "top6 player: " + this.state.top10player[6].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
      
            value={ this.state.top10player.length < 8 ? "" : "top7 player: " + this.state.top10player[7].username}
            autoComplete="current-password"
            />
                      <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
            
            value={ this.state.top10player.length < 9 ? "" : "top8 player: " + this.state.top10player[8].username}
            autoComplete="current-password"
            />
            <TextField
            read-Only
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Username"
    
            value={ this.state.top10player.length < 10 ? "" : "top9 player: " + this.state.top10player[9].username}
            autoComplete="current-password"
            />
         
          </Container>
            </React.Fragment>
          );

    }

}

export default SearchPage;