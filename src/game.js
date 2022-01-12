import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Header from './components/header';
import { Drawer } from '@material-ui/core';
import { drawInfo, drawObj, drawPlayer, drawBot} from './draw';
import fist from './resources/fist.png';
import pistol from './resources/pistol.png';
import rifle from './resources/rifle.png';
import rpg from './resources/rpg.png';
import ammo from './resources/ammo.png';
import {isMobile} from 'react-device-detect';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AutorenewOutlinedIcon from '@material-ui/icons/AutorenewOutlined';
import PanToolOutlinedIcon from '@material-ui/icons/PanToolOutlined';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

var mouseDown=false;
var connected=false;
var socket, canvas;
var id=null;
var mapHeight;
var mapWidth;
var playerNum;
var players=[];
var objs=[];
var bots=[];
var px, py, cameraX, cameraY;
var player=null;
var username;
var paused=false;
var time, round, countdown, circleX, circleY, circleRadius;

function switchWeapon(){
	socket.send(JSON.stringify({"gameplay": {"data": {"id": id, "type": 'switchWeapon'}}}));
}
function setVelocityX(val){
	socket.send(JSON.stringify({"gameplay": {"data": {"id": id, "type": 'setVelocityX', "val": val}}}));
}
function setVelocityY(val){
	socket.send(JSON.stringify({"gameplay": {"data": {"id": id, "type": 'setVelocityY', "val": val}}}));
}
function getStagePositionX(){
	return canvas.width/2-cameraX;
}

function getStagePositionY(){
	return canvas.height/2-cameraY;
}

function pickup() {
	socket.send(JSON.stringify({"gameplay": {"data": {"id": id, "type": 'pickup'}}}));
}
function aim(x, y) {
	var x1=x-getStagePositionX();
	var y1=y-getStagePositionY();
	socket.send(JSON.stringify({"gameplay": {"data": {"id": id, "type": 'aim', "x": x1, "y": y1}}}));
}
function fireWeapon() {
	socket.send(JSON.stringify({"gameplay": {"data": {"id": id, "type": 'fireWeapon'}}}));
}

function updateCamera(){
	cameraX=px;
	cameraY=py;
	if(px<=canvas.width/2){
		cameraX=canvas.width/2;
	}
	if(px>=(mapWidth-canvas.width/2)){
		cameraX=mapWidth-canvas.width/2;
	}
	if(py<=canvas.height/2){
		cameraY=canvas.height/2;
	}
	if(py>=(mapHeight-canvas.height/2)){
		cameraY=mapHeight-canvas.height/2;
	}
	
}
var sent = true;
function sendtoDB(){
	if(sent){
		sent=false;
		fetch('/api/updatecore', {
			method: "PUT",
			dataType: "JSON",
			headers: {
			  "Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({"username": username, "points": player.points})
		  })
		  .then((resp) => {
			return ;
		  }) 
		  .catch((error) => {
		  })
	}
}
function updatePosition(){
	for(var i=0;i<players.length;i++){
		if(players[i].data.id===id){
			px=players[i].data.position.x;
			py=players[i].data.position.y;
			player=players[i].data;
			if(player.health<=0){
				sendtoDB();
			}
			updateCamera();
			return;
		}
	}
}
function draw(){
	const { width, height } = canvas.getBoundingClientRect();
    if(canvas.width !== width || canvas.height !== height) {
		const ratio = window.devicePixelRatio || 1;
		canvas.width = width * ratio *0.9;
		canvas.height = height * ratio * 0.9;
	}
	const context = canvas.getContext("2d");
	context.clearRect (0, 0, canvas.width, canvas.height);	
	context.fillStyle='rgba(140, 225, 150, 1)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	if(id!==null){
		updatePosition();
		for(var i=0;i<objs.length;i++){
			drawObj(objs[i], context, getStagePositionX(), getStagePositionY());
		}
		for(var i=0;i<players.length;i++){
			drawPlayer(id, players[i], context, getStagePositionX(), getStagePositionY());
		}
		for(var i=0;i<bots.length;i++){
			drawBot(bots[i],context,getStagePositionX(), getStagePositionY());
		}
		
	}
    context.fillStyle='rgba(16, 43, 234, 0.7)';
	context.beginPath(); 
    context.rect(0, 0, canvas.width, canvas.height);
	context.arc(Math.round(circleX+getStagePositionX()), Math.round(circleY+getStagePositionY()), circleRadius, 0, 2 * Math.PI, true); 
	context.fill();
	if(id!==null){

		drawInfo(player, countdown, round, playerNum, context, canvas.width, canvas.height);
	}
}
function update(message) {
	if(message.init){ // initialization msg from server, player granted one id
		alert("Connected to Game Server");
		id=message.init.id;
		console.log("current id: "+id);
		socket.send(JSON.stringify({"init_res": {"id": id}})); // tell server that id has been received, send back ack message
	}
	if(message.data){ // msg contain game data from server, this is where game logistics store 
		mapHeight=message.data.mapHeight;
		mapWidth=message.data.mapWidth;
		playerNum=message.data.playerNum;
		players=message.data.players;
		objs=message.data.objs;
		bots=message.data.bots;
		time=message.data.time;
		countdown=message.data.countdown;
		round=message.data.round;
		circleX=message.data.circleCentre.x;
		circleY=message.data.circleCentre.y;
		circleRadius=message.data.circleRadius;
		draw();
	}
}
function pressKey(e){
	if(id!==null){
		var key=e.key;
		if (key==='r') switchWeapon();
		if (key==='f') pickup();
		if (key==='a') setVelocityX(-4);
		if (key==='s') setVelocityY(4);        
		if (key==='d') setVelocityX(4);
		if (key==='w') setVelocityY(-4);
	}
}
function releaseKey(e){
	if(id!==null){
		var key=e.key;
		if (key==='a'||key==='d') setVelocityX(0);
		if (key==='s'||key==='w') setVelocityY(0);
	}
}

function moveMouse(e) {
	if(id!==null){
		var x = e.offsetX;
        var y = e.offsetY;
		const ratio = window.devicePixelRatio || 1;
		var cx = x * ratio *0.9;
		var cy = y * ratio * 0.9;
		aim(cx, cy);
	}
}
function mouseClick(e){
	if(id!==null){
		mouseDown=true;
		fireWeapon();
		setTimeout(function() {
			if(mouseDown&&player!==null&&player.weapon.data.type==='rifle') {
				mouseClick();
			}
		}, 10);
	}
}
function mouseRelease(e){
	if(id!==null){
		mouseDown=false;
	}
}
function touchMove(event){
	event.preventDefault();
	const ratio = window.devicePixelRatio || 1;
	for (var i = 0; i < event.touches.length ; i++) {
		var touch = event.touches[i];
		var x = touch.pageX;
		var y = touch.pageY;
		var cx = Math.round(x * ratio *0.9);
		var cy = Math.round(y * ratio * 0.9);
		aim(cx,cy);
	}
}
function touchTip(event){
	event.preventDefault();
	fireWeapon();
}

function touchXEnd(event){
	setVelocityX(0);
}
function touchYEnd(event){
	setVelocityY(0);
}

function touchLeft(event){
	event.preventDefault();
	for (var i = 0; i < event.touches.length ; i++) {
		setVelocityX(-4);
	}
}
function touchRight(event){
	event.preventDefault();
	for (var i = 0; i < event.touches.length ; i++) {
		setVelocityX(4);
	}
}
function touchUp(event){
	event.preventDefault();
	for (var i = 0; i < event.touches.length ; i++) {
		setVelocityY(-4);
	}
}
function touchDown(event){
	event.preventDefault();
	for (var i = 0; i < event.touches.length ; i++) {
		setVelocityY(4);
	}
}
function touchSwitch(event){
	switchWeapon();
}
function touchPickup(event){
	pickup();
}

function Canvas(props) {
	const [height, setHeight] = React.useState(Math.round(window.innerHeight*0.9));
	
	const canvasRef = useRef(null);
	const {app, title, sections, game} = props;

	function handleResize() {
		var h = Math.round(window.innerHeight*0.9);
		if(h!==height){
			if(h<200){
				setHeight(200);
			}else{
				setHeight(h);
			}
		}
	};
	function handler(title){
		if(title==='Logout'){
			if(connected){
				socket.close();
				id=null;
				connected=false;
			}
		}
		if(title==='Serach' || title==='Leaderboard'||title==='Game'||title==='Profile'){
			paused=true;
		}
	}
	React.useEffect(() => {
		username=app.state.username;
		canvas = canvasRef.current;
		if(paused){
			canvas.addEventListener('mousemove', moveMouse);
			canvas.addEventListener('mousedown', mouseClick);
			canvas.addEventListener('mouseup', mouseRelease);
			canvas.addEventListener('touchmove', touchMove);
			canvas.addEventListener('touchstart', touchTip);
			paused=false;
		}
		if(!connected){
			socket = new WebSocket(`ws://${window.location.hostname}:10001`);
			socket.onopen = function (event) {
				socket.send(JSON.stringify({"check":"start"}));
				connected=true;
				document.addEventListener('keydown', pressKey);
				document.addEventListener('keyup', releaseKey);
				canvas.addEventListener('mousemove', moveMouse);
				canvas.addEventListener('mousedown', mouseClick);
				canvas.addEventListener('mouseup', mouseRelease);
				canvas.addEventListener('touchmove', touchMove);
				canvas.addEventListener('touchstart', touchTip);
				document.getElementById('left').addEventListener('touchend', touchXEnd);
				document.getElementById('left').addEventListener('touchmove', touchLeft);
				document.getElementById('left').addEventListener('touchstart', touchLeft);
				document.getElementById('right').addEventListener('touchend', touchXEnd);
				document.getElementById('right').addEventListener('touchmove', touchRight);
				document.getElementById('right').addEventListener('touchstart', touchRight);
				document.getElementById('up').addEventListener('touchend', touchYEnd);
				document.getElementById('up').addEventListener('touchmove', touchUp);
				document.getElementById('up').addEventListener('touchstart', touchUp);
				document.getElementById('down').addEventListener('touchend', touchYEnd);
				document.getElementById('down').addEventListener('touchmove', touchDown);
				document.getElementById('down').addEventListener('touchstart', touchDown);
				document.getElementById('switch').addEventListener('touchstart', touchSwitch);
				document.getElementById('pickup').addEventListener('touchstart', touchPickup);
			};
			socket.onclose = function (event) {
				alert("Disconnected or unable to join Server");
				connected=false;
				game.setState({game: "setup"});
				document.removeEventListener('keydown', pressKey);
				document.removeEventListener('keyup', releaseKey);
				canvas.removeEventListener('mousemove', moveMouse);
				canvas.removeEventListener('mousedown', mouseClick);
				canvas.removeEventListener('mouseup', mouseRelease);
				canvas.addEventListener('touchmove', touchMove);
				canvas.addEventListener('touchstart', touchTip);
				document.getElementById('left').removeEventListener('touchend', touchXEnd);
				document.getElementById('left').removeEventListener('touchmove', touchLeft);
				document.getElementById('left').removeEventListener('touchstart', touchLeft);
				document.getElementById('right').removeEventListener('touchend', touchXEnd);
				document.getElementById('right').removeEventListener('touchmove', touchRight);
				document.getElementById('right').removeEventListener('touchstart', touchRight);
				document.getElementById('up').removeEventListener('touchend', touchYEnd);
				document.getElementById('up').removeEventListener('touchmove', touchUp);
				document.getElementById('up').removeEventListener('touchstart', touchUp);
				document.getElementById('down').removeEventListener('touchend', touchYEnd);
				document.getElementById('down').removeEventListener('touchmove', touchDown);
				document.getElementById('down').removeEventListener('touchstart', touchDown);
				document.getElementById('switch').removeEventListener('touchstart', touchSwitch);
				document.getElementById('pickup').removeEventListener('touchstart', touchPickup);
				
			};
			socket.onmessage = function (event) {
				update(JSON.parse(event.data));
			}
		}
		window.addEventListener('resize', handleResize);
		return _ => {
			window.removeEventListener('resize', handleResize)
	  	}
	})
	
	return (
		<div>
		<Header app={app} title={title} sections={sections} handler={handler}/>
    	<canvas ref={canvasRef} style={{cursor: "crosshair", width: "100%", height: height, boxShadow: "0px 0px 5px 1px black", border: "1px solid black"}}> </canvas></div>
  	);

}


const useStyles = makeStyles((theme) => ({
	paper: {
	  marginTop: theme.spacing(12),
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	},
	formControl: {
		minWidth: 200,
	}
  }));
  
function Welcome(props) {
	const classes = useStyles();
	const {game}=props;
	return (
	<div className={classes.paper}>
	  <Grid container justify="center" spacing={6}>
		  <Grid item xs={12}>
		  	<Grid container justify="center" spacing={2}>
				  <Grid item>
				  <Button onClick={()=>{game.setState({game: 'play'})}}variant="contained" size="large" color="primary">Join a Game</Button>
				  </Grid>
			</Grid>
		  </Grid>
		  <Grid item xs={12}>
		  	<Grid container justify="center" spacing={2}>
				  <Grid item>
				  <Button onClick={()=>{game.setState({game: 'new'})}}variant="contained" size="large" color="secondary">Start a game</Button>
				  </Grid>
			</Grid>
		  </Grid>
		</Grid>
	</div>
	);
}

function NewGame(props) {
	const classes = useStyles();
	const {game}=props;
	const [map, setMap] = React.useState('small');
	const [AInum, setAInum] = React.useState('none');
	const handleMap = (event) => {
		setMap(event.target.value);
	}
	const handleAInum = (event) => {
		setAInum(event.target.value);
	}
	function handleSubmit(){
		socket = new WebSocket(`ws://${window.location.hostname}:10001`);
		socket.onopen = function (event) {
			socket.send(JSON.stringify({"init":{"map": map, "aiNum": AInum}}));
		}
		socket.onmessage = function (event) {
			var msg = JSON.parse(event.data);
			if(msg.response==='yes'){
				game.setState({game: 'play'});
			}else{
				alert("Game already started");
				game.setState({game: 'setup'});
			}
		}

	}
	
	return (
		<div className={classes.paper}>
			<Grid container justify="center" spacing={6}>
		  	<Grid item xs={12}>
		  	<Grid container justify="center" spacing={2}>
			<Grid item>
			<FormControl className={classes.formControl}>
        		<InputLabel shrink id="map-label">
         			 Map Size
        		</InputLabel>
        		<Select
          			labelId="map-label"
          			id="map-label"
          			value={map}
          			onChange={handleMap}
          			displayEmpty
          			className={classes.selectEmpty}
       			 >
          		<MenuItem value={"small"}>
            		<em>Small</em>
          		</MenuItem>
				<MenuItem value={'medium'}>Medium</MenuItem>
          		<MenuItem value={'large'}>Large</MenuItem>
        		</Select>
      		</FormControl>
			</Grid>
			</Grid>
		  </Grid>
		  <Grid item xs={12}>
		  	<Grid container justify="center" spacing={2}>
			<Grid item>
			<FormControl className={classes.formControl}>
        		<InputLabel shrink id="ai-num-label">
         			 Number of AI
        		</InputLabel>
        		<Select
          			labelId="ai-num-label"
          			id="ai-num-label"
          			value={AInum}
          			onChange={handleAInum}
          			displayEmpty
          			className={classes.selectEmpty}
       			 >
          		<MenuItem value={"none"}>
            		<em>None</em>
          		</MenuItem>
				<MenuItem value={'few'}>Few</MenuItem>
          		<MenuItem value={'many'}>Many</MenuItem>
        		</Select>
      		</FormControl>
			</Grid>
			</Grid>
		  </Grid>
			<Grid item xs={12}>
			<Grid container justify="center" spacing={2}>
				  <Grid item>
				  <Button variant="contained" size="large" color="primary" onClick={handleSubmit}>Start Game</Button>
					</Grid>
			</Grid>
			</Grid>
			<Grid item xs={12}>
			<Grid container justify="center" spacing={2}>
				  <Grid item>
				  <Button variant="contained" size="large" color="secondary" onClick={()=>{game.setState({game: 'setup'})}}>Go Back</Button>
					</Grid>
			</Grid>
			</Grid>
			</Grid>
		</div>
	);
}
	
	
class Game extends React.Component {
    constructor(props){
		super(props);
        this.state = {
            game: "setup"
        }
		
    }
	handleClick= (event) => {
		this.state.game=event;
	}
    render() {	
		const {app, sections}=this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Container maxWidth="lg">
					{this.state.game ==='setup'? <Typography component="div" style={{ backgroundColor: '#8ce196', height: '100vh'}}>
							<Header app={app} title="2D Fortnite Game" sections={sections}/><Welcome game={this}/></Typography> : null}
					{this.state.game ==='new'? <Typography component="div" style={{ backgroundColor: '#8ce196', height: '100vh'}}>
							<Header app={app} title="2D Fortnite Game" sections={sections}/><NewGame game={this}/></Typography> : null}
					{this.state.game ==='play' ?
					<div>
					
                    <Canvas app={app} title="2D Fortnite Game" game={this} sections={sections}/>
					{isMobile ? <div id="control">
						<div id="left">
							<KeyboardArrowLeftIcon style={{fontSize: 60}}></KeyboardArrowLeftIcon>
						</div>
						<div id="right">
							<KeyboardArrowRightIcon style={{fontSize: 60}}></KeyboardArrowRightIcon>
						</div>
						<div id="up">
						<KeyboardArrowUpIcon style={{fontSize: 60}}></KeyboardArrowUpIcon>
						</div>
						<div id="down">
						<KeyboardArrowDownIcon style={{fontSize: 60}}></KeyboardArrowDownIcon>
						</div>

					</div> : null}
					{isMobile ? <div id="buttons">
						<div id="switch">
						<AutorenewOutlinedIcon style={{fontSize: 40}}></AutorenewOutlinedIcon>
						</div>
						<div id="pickup">
						<PanToolOutlinedIcon style={{fontSize: 40}}></PanToolOutlinedIcon>
						</div>
							</div> : null}
					
					</div> : null}
					<div style={{display: "none"}}>
						<img id='ammo' src={ammo} width="100" height="100"></img>
						<img id="pistol" src={pistol} width="100" height="100"></img>
						<img id="rifle" src={rifle} width="100" height="100"></img>
						<img id="rpg" src={rpg} width="100" height="100"></img>
						<img id="fist" src={fist} width="100" height="100"></img>
					</div>
                </Container>
            </React.Fragment>
        );
    }

}

export default Game;