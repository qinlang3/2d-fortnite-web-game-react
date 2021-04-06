import logo from './logo.svg';
import './App.css';
import Game from './game';
import React from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

class App extends React.Component {
	constructor(props){
		super(props);
	}
	state = {
		page: "Game",
		theme: window.localStorage.getItem('theme') ? window.localStorage.getItem('theme') : 'dark'
	}
	toggleTheme = () =>{
		const localTheme = window.localStorage.getItem('theme');
		window.localStorage.setItem('theme', localTheme ? (localTheme === 'light' ? 'dark' : 'light') : 'light');
		this.setState({theme: window.localStorage.getItem('theme')});
	}
	render() {
		const theme = createMuiTheme({
			palette: {
			  type: this.state.theme,
			  primary: {
				light: '#b193e7',
				main: '#3fe062',
				dark: '#665586',
				contrastText: '#fff',
			  },
			}
		});
		const sections = [
			{ title: 'Game'},
			{ title: 'Instruction'},
			{ title: 'Profile'},
			{ title: 'Stats'},
			{ title: 'Logout'}
		];
		return (
			<div>
			<ThemeProvider theme={theme}>
			<Game app={this} sections={sections}></Game>
			</ThemeProvider>
			</div>
		);
	}
	
}

export default App;
