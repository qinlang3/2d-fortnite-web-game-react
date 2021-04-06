// https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/
// https://medium.com/@viral_shah/express-middlewares-demystified-f0c2c37ea6a1
// https://www.sohamkamani.com/blog/2018/05/30/understanding-how-expressjs-works/

var port = 8000; 
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

/** 
 * This is middleware to restrict access to subroutes of /api/auth/ 
 * To get past this middleware, all requests should be sent with appropriate
 * credentials. Now this is not secure, but this is a first step.
 *
 * Authorization: Basic YXJub2xkOnNwaWRlcm1hbg==
 * Authorization: Basic " + btoa("arnold:spiderman"); in javascript
**/
app.use('/api/auth', function (req, res,next) {
	if (!req.headers.authorization) {
		return res.status(401).json({ error: 'No credentials sent!' });
  	}
	try {
		var m = /^Basic\s+(.*)$/.exec(req.headers.authorization);
		var user_pass = Buffer.from(m[1], 'base64').toString();
		m = /^(.*):(.*)$/.exec(user_pass); // probably should do better than this
		var username = m[1];
		var password = m[2];
		console.log(username+" "+password);
		let sql = 'SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)';
		pool.query(sql, [username, password], (err, pgRes) => {
		if (err){
					res.status(401).json({ error: 'Not authorized'});
		} else if(pgRes.rowCount == 1){
			res.game_diff = pgRes.rows[0]['gamedifficulity'];
			res.cur_user = username;
			res.psw = password;
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
	if (!req.headers.authorization) {
		return res.status(401).json({ error: 'No credentials sent!' });
  	}
	try {
		var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var lst = credentialsString.split(":");
		var [username,password,repeatpsw, gamedifficulity] = [lst[0], lst[1], lst[2], lst[3]]
		if (password != repeatpsw){
			console.log("Your password are not same");
			res.status(400).json({error: "Your password are not same"});
			return;
		}
		if (username == "" || password == "" || repeatpsw == ""){
			res.status(400).json({error: "All the registration fields can not be empty"});
			console.log("All the registration fields can not be empty");
			return;
		}
		let sql = "INSERT INTO ftduser (username, password, gamedifficulity) VALUES ($1, sha512($2), $3)";
        	pool.query(sql, [username, password, gamedifficulity], (err, pgRes) => {
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
	if (!req.headers.authorization) {
		return res.status(401).json({ error: 'No credentials sent!' });
  	}
	try {
		var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var lst = credentialsString.split(":");
		console.log(lst);
		var [username,password,repeatpsw, gamedifficulity] = [lst[0], lst[1], lst[2], lst[3]]
		if (password != repeatpsw){
			console.log("Your password are not same");
			res.status(400).json({error: "Your password are not same"});
			return;
		}
		if (gamedifficulity == "" || password == "" || repeatpsw == ""){
			res.status(400).json({error: "All the update fields can not be empty"});
			return;
		}
		let sql = "UPDATE ftduser SET password = sha512($1), gamedifficulity= $2 WHERE username = $3;";
        	pool.query(sql, [password, gamedifficulity, username], (err, pgRes) => {
  			if (err){
				console.log(err.message);
                res.status(401).json({ error: 'error'});
			} else {
				console.log("no error");
				next();
        	}
		});
	} catch(err) {
               	res.status(401).json({ error: 'Not authorized'});
	}
});


app.use('/api/authD', function (req, res,next) {
	if (!req.headers.authorization) {
		return res.status(401).json({ error: 'No credentials sent!' });
  	}
	try {
		var credentialsString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
		var lst = credentialsString.split(":");
		var username = lst[0];
		console.log(username);
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


app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

