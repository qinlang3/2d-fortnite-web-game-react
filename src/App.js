import logo from './logo.svg';
import './App.css';
import Game from './game';
import LoginPage from './login';
import ProfilePage from './profile';
import RegisterPage from './register';
import Leaderboard from './leaderboard';
import React from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			username: "",
			password: "",
			page: "Login",
			theme: window.localStorage.getItem('theme') ?  'dark': window.localStorage.getItem('theme')
		}
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
			{ title: 'Leaderboard'},
			{ title: 'Logout'}
		];
		console.log(this.state.page);
		if (this.state.page === "Game"){
			return (
				<div><ThemeProvider theme={theme}>
				<Game app={this} sections={sections}></Game></ThemeProvider></div>);
				
		}else if (this.state.page === "Login" || this.state.page === "Logout"){
			return (
				<div><ThemeProvider theme={theme}>
				<LoginPage app={this} username={this.state.username} password={this.state.password}></LoginPage></ThemeProvider></div>);
		}else if (this.state.page === "Register"){
			return (
				<div><ThemeProvider theme={theme}>
				<RegisterPage app={this}></RegisterPage></ThemeProvider></div>);
		}else if(this.state.page === "Profile"){
			return (
				<div><ThemeProvider theme={theme}>
				<ProfilePage app={this} username={this.state.username} password={this.state.password} sections={sections}></ProfilePage></ThemeProvider></div>);
		}else if(this.state.page === "Leaderboard"){
			return (
				<div><ThemeProvider theme={theme}>
				<Leaderboard app={this} sections={sections}></Leaderboard></ThemeProvider></div>);

		}
	}
	
}

export default App;
