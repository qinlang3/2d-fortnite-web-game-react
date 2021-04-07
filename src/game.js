import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Header from './components/header';
import { Drawer } from '@material-ui/core';
import { drawObj, drawPlayer } from './draw';

var connected=false;
var socket, canvas;
var id=null;
var mapHeight;
var mapWidth;
var players=[];
var objs=[];
var px, py, cameraX, cameraY;

function getStagePositionX(){
	return canvas.width/2-cameraX;
}

function getStagePositionY(){
	return canvas.height/2-cameraY;
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
			drawPlayer(players[i], context, getStagePositionX(), getStagePositionY());
		}
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
		players=message.data.players;
		objs=message.data.objs;
		draw();
	}
}

function keyEvents(eventType, event) {

};
function mouseEvents(eventType, event) {
	
};

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
				document.addEventListener('keydown', function (event) { keyEvents('keydown', event); });
				document.addEventListener('keyup', function (event) { keyEvents('keyup', event); });
				canvas.addEventListener('mousemove', function (event) { mouseEvents('mousemove', event) });
				canvas.addEventListener('mousedown', function (event) { mouseEvents('mousedown', event) });
				canvas.addEventListener('mouseup', function (event) { mouseEvents('mouseup', event) });
			};
			socket.onclose = function (event) {
				alert("disconnected");
				connected=false;
				document.removeEventListener('keydown', function (event) { keyEvents('keydown', event); });
				document.removeEventListener('keyup', function (event) { keyEvents('keyup', event); });
				canvas.removeEventListener('mousemove', function (event) { mouseEvents('mousemove', event) });
				canvas.removeEventListener('mousedown', function (event) { mouseEvents('mousedown', event) });
				canvas.removeEventListener('mouseup', function (event) { mouseEvents('mouseup', event) });
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
    	<canvas ref={canvasRef} style={{width: "100%", height: height, boxShadow: "0px 0px 5px 1px black", border: "1px solid black"}}> </canvas>
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
                </Container>
            </React.Fragment>
        );
    }

}

export default Game;