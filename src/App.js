import logo from './logo.svg';
import './App.css';
import Game from './game';
import LoginPage from './login';
import ProfilePage from './profile';
import RegisterPage from './register';
import Leaderboard from './leaderboard';
import SearchPage from './search';
import React from 'react';


class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			username: "",
			password: "",
			page: "Login",
			
		}
	}


	render() {
		const sections = [
			{ title: 'Game'},
			{ title: 'Search'},
			{ title: 'Profile'},
			{ title: 'Leaderboard'},
			{ title: 'Logout'}
		];
		console.log(this.state.page);
		if (this.state.page === "Game"){
			return (
				<Game app={this} sections={sections}></Game>);
				
		}else if (this.state.page === "Login" || this.state.page === "Logout"){
			return (
				
				<LoginPage app={this} username={this.state.username} password={this.state.password}></LoginPage>);
		}else if (this.state.page === "Register"){
			return (
				<RegisterPage app={this}></RegisterPage>);
		}else if(this.state.page === "Profile"){
			return (
			
				<ProfilePage app={this} username={this.state.username} password={this.state.password} sections={sections}></ProfilePage>);
		}else if(this.state.page === "Leaderboard"){
			return (	
				<Leaderboard app={this} sections={sections}></Leaderboard>);
		}else if(this.state.page === "Search"){
			return (
				<SearchPage app={this} sections={sections}></SearchPage>);

		}
	}
	
}

export default App;
