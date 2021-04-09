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

var stage = new Stage();
var interval=null;
interval=setInterval(function(){ stage.step(); broadcast(); },20);

wss.on('close', function() {
    console.log('disconnected');
});
var clients=[]; for(var i=0;i<50;++i) clients[i]=0;
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

	var id = placePlayer();
	stage.playerJoin(id);
	

	// send initialization msg contains id to client
	ws.send(JSON.stringify({"init": {"id": id}}));

	ws.on('message', function(message) {
		console.log("messge from client: "+message);
		var msg=JSON.parse(message);
		if(msg.init_res){ // client receives initialization msg
			ws.send(JSON.stringify(stage)); // send copy of game data to client
			return;
		}
		if(msg.gameplay){
			stage.update(msg.gameplay.data);
			return;
		}
	});
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
	// if (!req.headers.authorization) {
	// 	return res.status(401).json({ error: 'No credentials sent!' });
  	// }
	try {
		var [username,password] = [req.body["username"], req.body["password"]]
		console.log(username+" "+password);
		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
		pool.query(sql, [username, password], (err, pgRes) => {
		if (err){
					res.status(401).json({ error: 'Not authorized'});
		} else if(pgRes.rowCount == 1){
			// res.game_diff = pgRes.rows[0]['gamedifficulity'];
			// res.cur_user = username;
			// res.psw = password;
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
	// if (!req.headers.authorization) {
	// 	return res.status(401).json({ error: 'No credentials sent!' });
  	// }
	try {
		console.log(req.body);
		var [username,password,repeatpsw] = [req.body["username"], req.body["password"], req.body["confirmpassword"]]
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
		let sql = "INSERT INTO ftduser (username, password) VALUES ($1, sha512($2))";
        	pool.query(sql, [username, password], (err, pgRes) => {
  			if (err){
				console.log(err.message);
                res.status(409).json({ error: 'The username is already been used'});
			} else {
				next();
        	}
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});


app.use('/api/authU', function (req, res,next) {
	// if (!req.headers.authorization) {
	// 	return res.status(401).json({ error: 'No credentials sent!' });
  	// }
	try {
		var [username, password,repeatpsw] = [req.body["username"], req.body["password"], req.body["confirmpassword"]]
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
	// if (!req.headers.authorization) {
	// 	return res.status(401).json({ error: 'No credentials sent!' });
  	// }
	try {
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


app.post('/api/authR/register', function (req, res) {
	res.status(200); 
	res.json({"message":"register success"}); 
});

app.post('/api/auth/login', function (req, res) {
	res.status(200); 
	res.json({"message":"authentication success", "user": res.cur_user, "password": res.psw, "game_diff": res.game_diff}); 
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


