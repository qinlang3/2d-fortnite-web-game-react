import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Header from './components/header';
import { Drawer } from '@material-ui/core';
import { drawInfo, drawObj, drawPlayer } from './draw';
import fist from './resources/fist.png';
import pistol from './resources/pistol.png';
import rifle from './resources/rifle.png';
import rpg from './resources/rpg.png';
import ammo from './resources/ammo.png';



var mouseDown=false;
var connected=false;
var socket, canvas;
var id=null;
var mapHeight;
var mapWidth;
var playerNum;
var players=[];
var objs=[];
var px, py, cameraX, cameraY;
var player=null;

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

function updatePosition(){
	for(var i=0;i<players.length;i++){
		if(players[i].data.id===id){
			px=players[i].data.position.x;
			py=players[i].data.position.y;
			player=players[i].data;
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
		drawInfo(player, playerNum, context, canvas.width, canvas.height);
	}
}
function update(message) {
	if(message.init){ // initialization msg from server, player granted one id
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


function Canvas() {
	const [height, setHeight] = React.useState(Math.round(window.innerHeight*0.9));
	
	const canvasRef = useRef(null);

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
	
	React.useEffect(() => {
		canvas = canvasRef.current;
		if(!connected){
			socket = new WebSocket(`ws://${window.location.hostname}:10001`);
			socket.onopen = function (event) {
				alert("connected");
				connected=true;
				document.addEventListener('keydown', pressKey);
				document.addEventListener('keyup', releaseKey);
				canvas.addEventListener('mousemove', moveMouse);
				canvas.addEventListener('mousedown', mouseClick);
				canvas.addEventListener('mouseup', mouseRelease);
			};
			socket.onclose = function (event) {
				alert("disconnected");
				connected=false;
				document.removeEventListener('keydown', pressKey);
				document.removeEventListener('keyup', releaseKey);
				canvas.removeEventListener('mousemove', moveMouse);
				canvas.removeEventListener('mousedown', mouseClick);
				canvas.removeEventListener('mouseup', mouseRelease);
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
    	<canvas ref={canvasRef} style={{cursor: "crosshair", width: "100%", height: height, boxShadow: "0px 0px 5px 1px black", border: "1px solid black"}}> </canvas>
  	);

}

class Game extends React.Component {
    constructor(props){
		super(props);
        this.state = {
            gameRooms: []
        }
		
    }
    render() {
		const {app, sections}=this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Container maxWidth="lg">
					<Header app={app} title="2D Fortnite Game" sections={sections}/>
                    <Canvas/>
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