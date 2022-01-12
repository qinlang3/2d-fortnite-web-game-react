var staticPort = 10000;
var webSocketPort = staticPort+1;
const Stage = require('./model.js');

var express = require('express');
var app = express();

const { Pool } = require('pg')
const pool = new Pool({
    user: 'webdbuser',
    host: 'localhost',
    database: 'webdb',
    password: 'password',
    port: 5432
});

const bodyParser = require('body-parser'); // we used this middleware to parse POST bodies

function isObject(o){ return typeof o === 'object' && o !== null; }
function isNaturalNumber(value) { return /^\d+$/.test(value); }

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.raw()); // support raw bodies


app.use('/',express.static("build"));

//var stage;
//stage = new Stage(null, null, null, null);

app.listen(staticPort, function () {
	console.log('ftd server run on port:'+staticPort);
});

var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: webSocketPort});

wss.broadcast = function(message){
	for(let ws of this.clients){ 
		ws.send(message); 
	}
}

function broadcast(){
	//var message=stage.toString();
	if(stage.hasChanged()){
		wss.broadcast(JSON.stringify(stage));
		stage.updateChanged(false);
	}
}
var newGame=true;
var stage = null;
var interval=null;
var clients=[];


wss.on('close', function() {
    console.log('disconnected');
});


function placePlayer(){
	for(var i=0;i<clients.length;i++){
		if(!clients[i]){
			clients[i]=1;
			return i;
		}
	}
	return -1;
}

wss.on('connection', function(ws) {
	
	if(!newGame){ // game started
		console.log('im here');
		var id = placePlayer();
		if(id==-1){ // game full
			ws.send(JSON.stringify({"initFail": "initFail"}));
			ws.close();
			return;
		}else{
			stage.playerJoin(id);
			// send initialization msg contains id to client
			ws.send(JSON.stringify({"init": {"id": id}}));
			ws.on('message', function(message) {
				// console.log("messge from client: "+message);
				var msg=JSON.parse(message);
				if(msg.check){
					return;
				}
				if(msg.init){
					ws.send(JSON.stringify({'response': "no"}));
					ws.close();
				}
				if(msg.init_res){ // client receives initialization msg
					ws.send(JSON.stringify(stage)); // send copy of game data to client
					return;
				}
				if(msg.gameplay){
					stage.update(msg.gameplay.data);
					return;
				}
			});
			return;
		}
	}
	if(newGame){
		console.log("im here");
		ws.on('message', function(message) {
			var msg=JSON.parse(message);
			if(msg.init){
				console.log("trying");
				stage=new Stage(msg.init.map, msg.init.aiNum);
				interval=setInterval(function(){ stage.step(); broadcast();},20);
				for(var i=0;i<50;++i) clients[i]=0;
				ws.send(JSON.stringify({'response': "yes"}));
				newGame=false;
				ws.close();
			}else{
				console.log("trying to s");
				ws.send(JSON.stringify({"initFail": "initFail"}));
				ws.close();
			}
			return;
		});
		return;
	}
});

/** 
 * This is middleware to restrict access to subroutes of /api/auth/ 
 * To get past this middleware, all requests should be sent with appropriate
 * credentials. Now this is not secure, but this is a first step.
 *
 * Authorization: Basic YXJub2xkOnNwaWRlcm1hbg==
 * Authorization: Basic " + btoa("arnold:spiderman"); in javascript
**/
app.use('/api/auth', function (req, res,next) {
	try {
		if (Object.keys(req.body).length != 2 || ! "username" in req.body || ! "password" in req.body ){
			res.status(400).json({ error: 'This is a bad request'});
			return;
		}
		var [username,password] = [req.body["username"], req.body["password"]]
		console.log(username+" "+password);
		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
		pool.query(sql, [username, password], (err, pgRes) => {
		if (err){
					res.status(401).json({ error: 'Not authorized'});
		} else if(pgRes.rowCount == 1){
			next(); 
		} else {
					res.status(409).json({ error: 'Your username and password does not match'});
		}
		});

	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});

app.use('/api/authR', function (req, res,next) {
	try {
		var [username,password,repeatpsw] = [req.body["username"], req.body["password"], req.body["confirmpassword"]]
		if (Object.keys(req.body).length != 3 || ! "username" in req.body || ! "password" in req.body || ! "confirmpassword" in req.body){
			res.status(400).json({ error: 'This is a bad request'});
			console.log("caonimaee");
			return;
		}
		if (password != repeatpsw){
			console.log("Your password are not same");
			res.status(400).json({error: "Your password are not same"});
			return;
		}
		if (username == "" || password == "" || repeatpsw == ""){
			res.status(401).json({error: "All the registration fields can not be empty"});
			console.log("All the registration fields can not be empty");
			return;
		}
		console.log(username);
		console.log(password);
		let sql = "INSERT INTO ftduser (username, password, totalscore) VALUES ($1, sha512($2), $3)";
        	pool.query(sql, [username, password, 0], (err, pgRes) => {
  			if (err){
				  
				console.log(err.message);
                res.status(409).json({ error: 'The username is already been used'});
			} else {
				console.log(pgRes.rows);
				next();
        	}

		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});


app.use('/api/authU', function (req, res,next) {
	try {
		var [username, password,repeatpsw] = [req.body["username"], req.body["password"], req.body["confirmpassword"]]
		if (Object.keys(req.body).length != 3 || ! "username" in req.body || ! "password" in req.body || ! "confirmpassword" in req.body){
			res.status(400).json({ error: 'This is a bad request'});
			return;
		}
		if (password != repeatpsw){
			console.log("Your password are not same");
			res.status(400).json({error: "Your password are not same"});
			return;
		}
		if (password == "" || repeatpsw == ""){
			res.status(401).json({error: "All the password fields can not be empty"});
			return;
		}
		let sql = "UPDATE ftduser SET password = sha512($2)WHERE username = $1;";
        	pool.query(sql, [username, password], (err, pgRes) => {
  			if (err){
				console.log(err.message);
                res.status(401).json({ error: 'error'});
			} else {
				console.log("really no error");
				next();
        	}
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});


app.use('/api/authD', function (req, res,next) {
	try {
		if (Object.keys(req.body).length != 1 || ! "username" in req.body ){
			res.status(400).json({ error: 'This is a bad request'});
			return;
		}
		var [username] = [req.body["username"]]
		let sql = "DELETE FROM ftduser WHERE username=$1;";
        	pool.query(sql, [username], (err, pgRes) => {
  			if (err){
				console.log(err.message);
                res.status(401).json({ error: 'error'});
			} else {
				next();
        	}
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});





app.delete('/api/authD/delete', function (req, res) {
	res.status(200); 
	res.json({"message":"Delete user successfully"}); 
});

app.put('/api/authU/update', function (req, res) {
	res.status(200); 
	res.json({"message":"profile successfully update"}); 
});


app.put('/api/updatecore', function (req, res,next) {
	try {
		if (Object.keys(req.body).length != 2 || ! "username" in req.body || ! "points" in req.body){
			res.status(400).json({ error: 'This is a bad request'});
			return;
		}
		var [username, score] = [req.body["username"], req.body["points"]];
		console.log(username);
		console.log(score);
		let sql = "UPDATE ftduser SET totalscore=totalscore+$2 WHERE username=$1;";
        	pool.query(sql, [username, score], (err, pgRes) => {
  			if (err){
				console.log(err.message);
                res.status(401).json({ error: 'error'});
			} else {
				res.status(200).json({ success: 'update successfully'});
        	}
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});


app.post('/api/authR/register', function (req, res) {
	res.status(200); 
	res.json({"message":"register success"}); 
});


app.post('/api/auth/login', function (req, res) {
	res.status(200); 
	res.json({"message":"authentication success", "user": res.cur_user, "password": res.psw, "game_diff": res.game_diff}); 
});


app.get('/api/view/search/:username/', function (req, res,next) {
	try {
		var username = req.params.username; 
		username = username.substring(1, username.length);
		let sql = 'SELECT * FROM ftduser WHERE username=$1';
		pool.query(sql, [username], (err, pgRes) => {
		if (err){
			res.status(401).json({ error: 'Not authorized'});
			return;
		} else if(pgRes.rowCount == 1){
			res.status(200).json({ no_error: 'request success'}); 
			return;
		} else if (pgRes.rowCount == 0){
			res.status(404).json({ error: 'This username does not exist in our game'});
			return;
		}	
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});


app.get('/api/view/getTop10player', function (req, res,next) {
	try {
		let sql = 'SELECT username, totalscore FROM ftduser ORDER BY totalscore DESC LIMIT 10';
		pool.query(sql, [], (err, pgRes) => {
		if (err){
			res.status(401).json({ error: 'Not authorized'});
			return;
		}else{
			res.status(200).json({ success: pgRes.rows});
			console.log(pgRes.rows);
		}
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});

// go to register page
app.get('/api/view/register', function (req, res) {
	res.status(200); 
	res.json({"message":"go to register page"}); 
});


app.get('/api/view/logout', function (req, res) {
	res.status(200); 
	res.json({"message":"go to login page"}); 
});


app.get('/api/view/instruction', function (req, res) {
	res.status(200); 
	res.json({"message":"go to instruction page"}); 
});


app.get('/api/view/profile', function (req, res) {
	res.status(200); 
	res.json({"message":"go to profile page"}); 
});

app.get('/api/view/game', function (req, res) {
	res.status(200); 
	res.json({"message":"go to game page"}); 
});




