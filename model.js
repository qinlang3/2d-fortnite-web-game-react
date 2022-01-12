const { NextWeekRounded } = require("@material-ui/icons");

function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(mapSize, AInum){
		//this.canvas = canvas;
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		//this.player=null; // a special actor, the player
		// the logical width and height of the stage (display area)
		//this.width=canvas.width;
		//this.height=canvas.height;
		//this.difficulty='easy';
		//var enemCount=50;
		this.changed=true;
		/*
		if(difficulty=='meidum') this.difficulty='meidum';
		if(difficulty=='hard') this.difficulty='hard';
		if(enemNum=='meidum') enemCount=100;
		if(enemNum=='many') enemCount=200;
		if(obstacles=='meidum') obstaclesCount=500;
		if(obstacles=='many') obstaclesCount=1000;*/

		// the actual width and height of the map
		var obstaclesCount=50;
		if(mapSize=='small'){
			this.mapWidth = 2000;
			this.mapHeight = 2000;
		}else{
			this.mapWidth = 2000;
			this.mapHeight = 2000;
		}
		this.gametime=0;
		this.countdown=5;
		this.circleCooling=true;
		this.round=1;
		this.targetCircleRadius=this.mapWidth/2*0.8;
		var x = this.targetCircleRadius+Math.random()*(this.mapWidth-2*this.targetCircleRadius);
		var y = this.targetCircleRadius+Math.random()*(this.mapWidth-2*this.targetCircleRadius);
		this.targetCircleCentre=new Pair(x, y);
		this.currCircleRadius=Math.ceil(this.mapWidth/2*Math.sqrt(2));
		this.currCircleCentre=new Pair(this.mapWidth/2,this.mapWidth/2);
		this.radiusChange=(this.currCircleRadius-this.targetCircleRadius)/1500;
		this.centreChangeX=(this.targetCircleCentre.x-this.currCircleCentre.x)/1500;
		this.centreChangeY=(this.targetCircleCentre.y-this.currCircleCentre.y)/1500;
		setInterval(this.updateRound.bind(this), 1000);

		/*}else if(mapSize=='medium'){
			obstaclesCount=150;
			this.mapWidth = 5000;
			this.mapHeight = 5000;

		}else{
			obstaclesCount=500;
			this.mapWidth = 10000;
			this.mapHeight = 10000;
		}*/
		while(obstaclesCount>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight));
			var width=100+randint(100);
			var height=100+randint(100);
			var result=this.checkOverlap(x,y,width,height);
			if(!result){
				var velocity = new Pair(0, 0);
				var radius = 15;
				var colour='rgba(195,102,56,1)';
				var position = new Pair(x,y);
				this.addActor(new Obstacle(this, position, velocity, colour, radius, width, height));
				obstaclesCount--;
			}
		}
		this.playerNum=0;
		var num=0;
		if(AInum=='few'){
			num=10;
		}
		if(AInum=='many'){
			num=30;
		}
		var counter=1000;
		while(num>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight)); 
			if(this.getActor(x,y)===null){
				var result=this.checkOverlapPlayer(x, y, 24);
				if(!result){
					var velocity = new Pair(Math.round(Math.random()*3), Math.round(Math.random()*3));
					var radius = 24;
					var colour= 'rgba(111,221,91,1)';
					var position = new Pair(x,y);
					var gen=Math.round(Math.random()*10);
					var type = 'level2';
					if(gen>=8){
						type = 'level3';
					}
					this.addPlayer(new Bot(this, counter, position, velocity, colour, radius, type));
					num--;
					counter++;
				}
			}
		}
		// Add the player to the center of the map
		/*var velocity = new Pair(0,0);
		var radius = 24;
		var colour= 'rgba(217,189,164,1)';
		var position = new Pair(Math.floor(this.mapWidth/2), Math.floor(this.mapHeight/2));*/
		// Set camrea focus on the player
		//this.camera = new Pair(Math.floor(this.mapWidth/2), Math.floor(this.mapHeight/2));
		// Add the player
		//this.addPlayer(new Player(this, position, velocity, colour, radius));
		// the number of total enemies
		// this.enemNum=0;
		// Add in obstacles
		
		// Add in enemies 
		/*
		var level1=Math.round(enemCount*0.5);
		var level2=Math.round(enemCount*0.3);
		while(level1>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight)); 
			if(this.getActor(x,y)===null){
				result=this.checkOverlap(x-15,y-15,30,30);
				if(!result){
					var velocity = new Pair(rand(3), rand(3));
					var radius = 24;
					var colour= 'rgba(111,221,91,1)';
					var position = new Pair(x,y);
					var type = 'level1';
					this.addActor(new Enemy(this, position, velocity, colour, radius, type));
					level1--;
					enemCount--;
				}
			}
		}
		while(level2>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight)); 
			if(this.getActor(x,y)===null){
				result=this.checkOverlap(x-15,y-15,30,30);
				if(!result){
					var velocity = new Pair(rand(3), rand(3));
					var radius = 24;
					var colour= 'rgba(111,221,91,1)';
					var position = new Pair(x,y);
					var type = 'level2';
					this.addActor(new Enemy(this, position, velocity, colour, radius, type));
					level2--;
					enemCount--;
				}
			}
		}
		while(enemCount>0){
			var x=Math.floor((Math.random()*this.mapWidth)); 
			var y=Math.floor((Math.random()*this.mapHeight)); 
			if(this.getActor(x,y)===null){
				result=this.checkOverlap(x-15,y-15,30,30);
				if(!result){
					var velocity = new Pair(rand(3), rand(3));
					var radius = 28;
					var colour= 'rgba(111,221,91,1)';
					var position = new Pair(x,y);
					var type = 'level3';
					this.addActor(new Enemy(this, position, velocity, colour, radius, type));
					enemCount--;
				}
			}
		}*/
	}
	updateRound() {
		this.gametime++;
		this.updateHealth();
		if(!this.circleCooling){ // circle is reducing
			if(this.countdown==0){
				if(this.round!=6){
					this.countdown=5; // 60 seconds of cooling
					this.circleCooling=true;
					this.nextRound();
				}
			}else{
				this.countdown--;
			}
		}else{	// circle is waiting to be reduced
			if(this.countdown==0){
				this.circleCooling=false;
				this.countdown=30; // 30 seconds to reduce the circle
			}else{
				this.countdown--;
			}

		}
		
	}
	nextRound() {
		if(this.round!=5) {
			this.targetCircleRadius=this.currCircleRadius/2;
			var theta=Math.random()*2*Math.PI;
			var r=Math.random()*this.targetCircleRadius;
	
			this.targetCircleCentre.x+=Math.cos(theta)*r;
			this.targetCircleCentre.y+=Math.sin(theta)*r;
	
			this.radiusChange=(this.currCircleRadius-this.targetCircleRadius)/1500;
			this.centreChangeX=(this.targetCircleCentre.x-this.currCircleCentre.x)/1500;
			this.centreChangeY=(this.targetCircleCentre.y-this.currCircleCentre.y)/1500;
			this.round++;
		}else{ // final round
			this.targetCircleCentre.x=this.currCircleCentre.x;
			this.targetCircleCentre.y=this.currCircleCentre.y;
			this.targetCircleRadius=0;
			this.radiusChange=this.currCircleRadius/1500;
			this.centreChangeX=0;
			this.centreChangeY=0;
			this.round++;
		}
	}
	updateHealth() {
		for(var i=0;i<this.actors.length;i++){
			if((this.actors[i] instanceof Bot)||(this.actors[i] instanceof Player)){
				if(this.actors[i].outsideCircle) {
					this.actors[i].health-=10;
					this.actors[i].beingHit=true;
				}
			}
		}
	}
	hasChanged() {
		return this.changed;
	}
	updateChanged(val) {
		this.changed = val;
	}
	checkWon(){
		if(this.enemNum==0){
			return true;
		}else{
			return false;
		}
	}
	checkOverlap(x,y,width,height){
		for(var i=0;i<this.actors.length;i++){
			var x1=this.actors[i].position.x;
			var y1=this.actors[i].position.y;
			if(this.actors[i] instanceof Obstacle){	
				var xRange=x1+this.actors[i].width;
				var yRange=y1+this.actors[i].height;
				if((x1<=x&&x<=xRange&&y1<=y&&y<=yRange)||(x1<=(x+width)&&x<x1&&y1<=y&&y<=yRange)||
					(x1<=x&&x<=xRange&&y1<=(y+height)&&y<y1)||(x1<=(x+width)&&x<x1&&y1<=(y+height)&&y<y1)){	
					return true;
				}
			}
			if(this.actors[i] instanceof Player){
				var radius=this.actors[i].radius;
				if((x<=(x1-radius)&&(x1-radius)<=(x+width)&&y<=(y1-radius)&&(y1-radius)<=(y+height))||
					(x<=(x1+radius)&&(x1-radius)<x&&y<=(y1-radius)&&(y1-radius)<=(y+height))||
					(x<=(x1-radius)&&(x1-radius)<=(x+width)&&y<=(y1+radius)&&(y1-radius)<y)||
					(x<=(x1+radius)&&(x1-radius)<x&&y<=(y1+radius)&&(y1-radius)<y)){
					return true;
				}
			}
		}
		return false;
	}
	checkOverlapPlayer(x, y, radius) {
		for(var i=0;i<this.actors.length;i++){
			var x1=this.actors[i].position.x;
			var y1=this.actors[i].position.y;
			if(this.actors[i] instanceof Obstacle){	
				var xRange=x1+this.actors[i].width;
				var yRange=y1+this.actors[i].height;
				if((y1-radius<y&&y<yRange+radius)&&(x1-radius<x&&x<xRange+radius)){
					return true;
				}
			}
			if(this.actors[i] instanceof Player){
				var radius2=this.actors[i].radius;
				var distX=x1-x;
				var distY=y1-y;
				if(Math.sqrt(distX*distX+distY*distY)<=radius+radius2){
					return true;
				}
			}
		}
		return false;
	}
	playerJoin(id) {
		var red = Math.round(Math.random()*255);
		var blue = Math.round(Math.random()*255);
		var green = Math.round(Math.random()*255);
		var color = `rgba(${red},${green},${blue}, 1)`;
		var velocity = new Pair(0,0);
		var radius = 24;
		var x=Math.floor(this.mapWidth*Math.random());
		var y=Math.floor(this.mapHeight*Math.random());
		var result=this.checkOverlapPlayer(x, y, radius);
		while(result){
			x=Math.floor(this.mapWidth*Math.random());
			y=Math.floor(this.mapHeight*Math.random());
			result=this.checkOverlapPlayer(x, y, radius);
		}
		this.addPlayer(new Player(this, id, new Pair(x, y), velocity, color, radius));
	}

	addPlayer(player){
		this.addActor(player);
		this.playerNum++;
	}
	removePlayer(player){
		this.removeActor(player);
		this.playerNum--;
	}

	addActor(actor){
		this.actors.push(actor);
		this.updateChanged(true);
		//if(actor instanceof Enemy){
			//this.enemNum++;
		//}
	}

	
	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
			this.updateChanged(true);
		}
	}
	updateCamera(){
		var x=this.player.position.x;
		var y=this.player.position.y;
		this.camera.x=x;
		this.camera.y=y;
		if(this.player.position.x<=this.width/2){
			this.camera.x=this.width/2;
		}
		if(this.player.position.x>=(this.mapWidth-this.width/2)){
			this.camera.x=this.mapWidth-this.width/2;
		}
		if(this.player.position.y<=this.height/2){
			this.camera.y=this.height/2;
		}
		if(this.player.position.y>=(this.mapHeight-this.height/2)){
			this.camera.y=this.mapHeight-this.height/2;
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
		if(!this.circleCooling){
			this.currCircleRadius-=this.radiusChange;
			if(this.currCircleRadius<=0) this.currCircleRadius=0;
			this.currCircleCentre.x+=this.centreChangeX;
			this.currCircleCentre.y+=this.centreChangeY;
		}
		//this.updateCamera();
	}
	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}
	toJSON(){
		var objlist=[];
		var playerlist=[];
		var botlist=[]
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i] instanceof Bot){
				botlist.push(this.actors[i].toJSON());
			}else if (this.actors[i] instanceof Player){
				playerlist.push(this.actors[i].toJSON());
			}else{
				objlist.push(this.actors[i].toJSON());
			}
		}
		return {
			data: {
				mapWidth: this.mapWidth,
				mapHeight: this.mapHeight,
				playerNum: this.playerNum,
				objs: objlist,
				players: playerlist,
				bots: botlist,
				time: this.gametime,
				countdown: this.countdown,
				round: this.round,
				circleCentre: this.currCircleCentre.toJSON(),
				circleRadius: this.currCircleRadius
			}
		}
	}
	getPlayer(id){
		for(var i=0;i<this.actors.length;i++){
			if((this.actors[i] instanceof Player)&&this.actors[i].id==id){
				return this.actors[i];
			}
		}
		return null;

	}
	update(data){
		var id=data.id;
		if(this.getPlayer(id)){
			if(data.type=='switchWeapon'){
				this.getPlayer(id).switchWeapon();
			}
			if(data.type=='setVelocityX'){
				var amount=data.val;
				this.getPlayer(id).setVelocityX(amount);
			}
			if(data.type=='setVelocityY'){
				var amount=data.val;
				this.getPlayer(id).setVelocityY(amount);
			}
			if(data.type=='pickup'){
				this.getPlayer(id).pickup();
			}
			if(data.type=='aim'){
				var x=data.x;
				var y=data.y;
				var target=new Pair(x, y);
				this.getPlayer(id).aim(target);
			}
			if(data.type=='fireWeapon'){
				this.getPlayer(id).fireWeapon();
			}
		}
	}
} // End Class Stage

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		var rx=rand(3);
		var ry=rand(3);
		this.x=rx*this.x/magnitude;
		this.y=ry*this.y/magnitude;
	}
	toJSON(){
		return {
			x: this.x,
			y: this.y
		}
	}
}

class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}
	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}
	setVelocityX(value){
		this.velocity.x=value;
	}
	setVelocityY(value){
		this.velocity.y=value;
	}
	getStagePositionX(x){
		return x+this.stage.width/2-this.stage.camera.x;
	}
	getStagePositionY(y){
		return y+this.stage.height/2-this.stage.camera.y;
	}
}
class Obstacle extends Ball {
	constructor(stage, position, velocity, colour, radius, width, height){
		super(stage, position, velocity, colour, radius);
		this.width=width;
		this.height=height;
		this.health=50;
		this.deathCD=0;
		this.beingHit=false;
		this.hitCD=0;
	}
	toJSON(){
		return {
			class: "Obstacle",
			data: {
				position: this.position.toJSON(),
				velocity: this.velocity.toJSON(),
				colour: this.colour,
				radius: this.radius,
				width: this.width,
				height: this.height,
				beingHit: this.beingHit,
			}
		}
	}
	step(){
		if(this.health<0){
			this.health=0;
		}
		if(this.health==0){
			if(this.deathCD%2==0){
				this.beingHit=true;
			}else{
				this.beingHit=false;
			}
			this.deathCD++;
			if(this.deathCD==20){
				var gen=randint(100);
				if(gen<=90){	// 90% probability to drop some item
					var position=new Pair(Math.round(this.position.x+this.width/2), Math.round(this.position.y+this.height/2));
					this.stage.addActor(new Item(this.stage, position, new Pair(0, 0), 'rgba(0,0,0,1)',15));
				}
				this.stage.removeActor(this);
			}
			return;
		}
		if(this.beingHit){
			if(this.hitCD==2){
				this.beingHit=false;
				this.hitCD=0;
			}
			this.hitCD++;
		}
	}
}
class Item extends Ball {
	constructor(stage, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.type='first-aid';
		this.beingPicked=false;
		var gen=randint(100);
		if(0<=gen&&gen<30) this.type='first-aid';  // 30% probability to span a first-aid
		if(30<=gen&&gen<60) {this.type='ammo'; this.radius=20;}		// 30% probability to span a ammo supply
		if(60<=gen&&gen<85) {this.type='pistol'; this.radius=25;}	// 25% probaility to span a pistol
		if(85<=gen&&gen<95) {this.type='rifle'; this.radius=25;} 	// 10% probability to span a rifle
		if(95<=gen&&gen<100) {this.type='rpg'; this.radius=25;}		// 5% probability to span a RPG	
	}
	toJSON(){
		return {
			class: "Item",
			data: {
				position: this.position.toJSON(),
				velocity: this.velocity.toJSON(),
				colour: this.colour,
				radius: this.radius,
				type: this.type,
			}
		}
	}
	step(){
		if(this.beingPicked){
			this.stage.removeActor(this);
		}
	}
}
class Explosive extends Ball {
	constructor(stage, position, velocity, colour, radius, fireFrom, victim){
		super(stage, position, velocity, colour, radius);
		this.fireFrom=fireFrom; // the actor who fired this bullet
		this.counter=0;
		this.victims=[];
		this.victims.push(victim);
	}
	toJSON(){
		return {
			class: "Explosive",
			data: {
				position: this.position.toJSON(),
				velocity: this.velocity.toJSON(),
				colour: this.colour,
				radius: this.radius,
			}
		}
	}
	step(){
		if(this.counter<=25){
			this.radius+=2;
		}else{
			this.radius-=2;
		}
		this.counter++;
		if(this.counter==50){
			this.stage.removeActor(this);
			return;
		}
		for(var i=0;i<this.stage.actors.length;i++){
			if((this.stage.actors[i] instanceof Player)&&(this.stage.actors[i].id!=this.fireFrom.id)&&(!this.victims.includes(this.stage.actors[i]))){
				var distX=this.stage.actors[i].position.x-this.position.x;
				var distY=this.stage.actors[i].position.y-this.position.y;
				if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius){
					if(this.stage.actors[i].health>0){
						this.stage.actors[i].beingHit=true;
						this.stage.actors[i].health-=50;
						this.victims.push(this.stage.actors[i]);
					}
				}
			}
		}
		this.stage.updateChanged(true);
	}

}
class Bullet extends Ball {
	constructor(stage, position, velocity, colour, radius, type, fireFrom){
		super(stage, position, velocity, colour, radius);
		this.type=type;
		this.fireFrom=fireFrom; // the actor who fired this bullet
		this.range=0;
		if(this.type=='level1'){
			this.range=40;
		}
		if(this.type=='level2'){
			this.range=70;
		}
		if(this.type=='level3'){
			this.range=30;
		}
	}
	toJSON(){
		return {
			class: "Bullet",
			data: {
				position: this.position.toJSON(),
				velocity: this.velocity.toJSON(),
				colour: this.colour,
				radius: this.radius,
			}
		}
	}
	explosive(victim){
		var colour='rgba(255, 158, 12, 0.8)';
		this.stage.addActor(new Explosive(this.stage, this.position, new Pair(0,0), colour, 1, this.fireFrom, victim)); 
	}
	step() {
		// bullet has limited range
		if(this.range==0){
			if(this.type=='level3'){
				this.explosive(null);
			}
			this.stage.removeActor(this);
			return;
		}
		this.position.x+=this.velocity.x;
		this.position.y+=this.velocity.y;	
		for(var i=0;i<this.stage.actors.length;i++){
			if(this.stage.actors[i] instanceof Obstacle){
				var x=this.stage.actors[i].position.x;
				var y=this.stage.actors[i].position.y;
				var xRange=x+this.stage.actors[i].width;
				var yRange=y+this.stage.actors[i].height;
				// bullet hit obstacles or edge
				if((y-this.radius<this.position.y&&this.position.y<yRange+this.radius)&&
					(x-this.radius<this.position.x&&this.position.x<xRange+this.radius)){
					if(this.stage.actors[i].health>0){
						this.stage.actors[i].beingHit=true;
						if(this.type=='level1'||this.type=='level2'){
							this.stage.actors[i].health-=10;
						}else{
							this.stage.actors[i].health-=50;
							this.explosive(this.stage.actors[i]);
						}
					}
					this.stage.removeActor(this);
					return;
				}
			}
		}
		if(this.position.y<=0||this.position.y>=this.stage.mapHeight|| 
			this.position.x<=0||this.position.x>=this.stage.mapWidth){
			this.stage.removeActor(this);
			return;
		}
		var distX;
		var distY;
		for(var i=0;i<this.stage.actors.length;i++){
			if(this.stage.actors[i] instanceof Player){
				if(this.stage.actors[i].id!=this.fireFrom.id){
					distX=this.stage.actors[i].position.x-this.position.x;
					distY=this.stage.actors[i].position.y-this.position.y;
					// bullet hit someone
					if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius){
						if(this.stage.actors[i].health>0){
							this.stage.actors[i].beingHit=true;
							if(this.type=='level1'||this.type=='level2'){
								this.stage.actors[i].health-=10;
							}else{
								this.stage.actors[i].health-=50;
								this.explosive(this.stage.actors[i]);
							}
							if(this.stage.actors[i].health<=0){
								this.fireFrom.points++;
								if(this.stage.actors[i] instanceof Bot){
									this.fireFrom.msg="You killed Bot "+this.stage.actors[i].id;
								}else{
									this.fireFrom.msg="You killed Player "+this.stage.actors[i].id;
								}
								this.fireFrom.msgCD=0;

							}
						}
						this.stage.removeActor(this);
						return;
					}
				}
			}
		}
		this.range--;
		this.stage.updateChanged(true);	
	}
}


/*
class Enemy extends Ball {
	constructor(stage, position, velocity, colour, radius, type){
		super(stage, position, velocity, colour, radius);
		this.type=type;
		this.health=50;
		if(this.stage.difficulty=='hard') this.health=80;
		this.weapon='fist';
		if(this.type=='level2') this.weapon='rifle';
		if(this.type=='level3') {
			this.health=200; 
			if(this.stage.difficulty=='hard') this.health=300;
			this.weapon='rpg';
		}
		this.aim_target = new Pair(0, 0);  // Aim position which indicates the map position 
										   // where the aim crosshair is pointed at. 
		this.beingHit = false;
		this.fireCD=0;
		this.deathCD=0;
		this.detectRange=400;
		if(this.stage.difficulty=='meidum') this.detectRange=800;
		if(this.stage.difficulty=='hard') this.detectRange=1200;
	}
	
	draw(context){
		if(this.beingHit){  // being hit
			context.fillStyle = 'rgba(174,0,0,1)';
			this.beingHit=false;
		}else if(this.health==0){ // being dying
			if(this.deathCD%2==0){
				context.fillStyle='rgba(174,0,0, 1)';
			}else{
				context.fillStyle='rgba(111,221,91, 1)';
			}
			this.deathCD++;
			if(this.deathCD==20){ // dying period ends, remove this actor
				this.stage.removeActor(this);
				if(this.type=='level1'){
					this.stage.player.points+=2;
				}
				if(this.type=='level2'){
					this.stage.player.points+=4;
				}
				if(this.type=='level3'){
					this.stage.player.points+=10;
				}
			}
		}else{  // otherwise
			context.fillStyle=this.colour;
		}
		var stageX=this.getStagePositionX(this.position.x);
		var stageY=this.getStagePositionY(this.position.y);
		var x1=this.getStagePositionX(this.aim_target.x);
		var y1=this.getStagePositionY(this.aim_target.y);
		var x = Math.round(stageX);
		var y = Math.round(stageY);
		if(this.weapon=='fist'){
			var dist=Math.sqrt((x1-stageX)*(x1-stageX)+(y1-stageY)*(y1-stageY));
			var cos=Math.abs(x1-stageX)/dist;
			var sin=Math.abs(y1-stageY)/dist;
			var mag=Math.abs((Math.sqrt(2)/2)*(cos-sin));
			var mag2=Math.abs((Math.sqrt(2)/2)*(cos+sin));
			var deltaY=mag*this.radius;
			var deltaX=mag2*this.radius;
			var x2=0.0, y2=0.0, x3=0.0, y3=0.0;
			if(x1<=stageX&&y1<=stageY){
				if(sin>=cos){
					x2=stageX-deltaX;
					y2=stageY-deltaY;
					x3=stageX+deltaY;
					y3=stageY-deltaX;
				}else{
					x2=stageX-deltaX;
					y2=stageY+deltaY;
					x3=stageX-deltaY;
					y3=stageY-deltaX;
				}
			}
			if(x1>=stageX&&y1<=stageY){
				if(sin>=cos){
					x2=stageX-deltaY;
					y2=stageY-deltaX;
					x3=stageX+deltaX;
					y3=stageY-deltaY;
				}else{
					x2=stageX+deltaY;
					y2=stageY-deltaX;
					x3=stageX+deltaX;
					y3=stageY+deltaY;		
				}
			}
			if(x1>=stageX&&y1>=stageY){
				if(sin>=cos){
					x2=stageX+deltaX;
					y2=stageY+deltaY;
					x3=stageX-deltaY;
					y3=stageY+deltaX;
				}else{
					x2=stageX+deltaX;
					y2=stageY-deltaY;
					x3=stageX+deltaY;
					y3=stageY+deltaX;
				}
			}
			if(x1<=stageX&&y1>=stageY){
				if(sin>=cos){
					x2=stageX+deltaY;
					y2=stageY+deltaX;
					x3=stageX-deltaX;
					y3=stageY+deltaY;
				}else{
					x2=stageX-deltaY;
					y2=stageY+deltaX;
					x3=stageX-deltaX;
					y3=stageY-deltaY;	
				}
			}
			context.beginPath();
			context.arc(x2, y2, 6, 0, 2 * Math.PI, false); 
			context.fill();
			context.lineWidth=2;
			context.stroke();
			context.beginPath();
			context.arc(x3, y3, 8, 0, 2 * Math.PI, false); 
			context.fill();
			context.stroke();
			context.beginPath(); 
			context.arc(x, y, this.radius, 0, 2 * Math.PI, false); 
			context.fill();
			context.lineWidth=2;
			context.stroke();
			return;
		}
		if(this.weapon=='rifle'){
			context.beginPath(); 
			context.arc(x, y, this.radius, 0, 2 * Math.PI, false); 
			context.fill();
			context.lineWidth=2;
			context.stroke();
			var x2=(45*(x1-stageX)/Math.sqrt((x1-stageX)*(x1-stageX)+(y1-stageY)*(y1-stageY)))+stageX;
			var y2=(45*(y1-stageY)/Math.sqrt((x1-stageX)*(x1-stageX)+(y1-stageY)*(y1-stageY)))+stageY;
			context.lineWidth = 6;
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(Math.round(x2), Math.round(y2));
			context.stroke();	
		}
		if(this.weapon=='rpg'){
			context.beginPath(); 
			context.arc(x, y, this.radius, 0, 2 * Math.PI, false); 
			context.fill();
			context.lineWidth=2;
			context.stroke();
			var x2=(45*(x1-stageX)/Math.sqrt((x1-stageX)*(x1-stageX)
				+(y1-stageY)*(y1-stageY)))+stageX;
			var y2=(45*(y1-stageY)/Math.sqrt((x1-stageX)*(x1-stageX)
				+(y1-stageY)*(y1-stageY)))+stageY;
			var x3=((stageX-x1)*this.radius/Math.sqrt((x1-stageX)*(x1-stageX)
				+(y1-stageY)*(y1-stageY)))+stageX;
			var y3=((stageY-y1)*this.radius/Math.sqrt((x1-stageX)*(x1-stageX)
				+(y1-stageY)*(y1-stageY)))+stageY;
			context.lineWidth = 8;
			context.beginPath();
			context.moveTo(Math.round(x3), Math.round(y3));
			context.lineTo(Math.round(x2), Math.round(y2));
			context.strokeStyle='#1b6309';
			context.stroke();
			context.strokeStyle='#000000';
			return;
		}
	}
}
*/

class Weapon {
	constructor(playerid, type){
		this.playerid=playerid;
		this.type=type;
		this.ammo=0;
		this.fireCD=0;
		if(this.type=='pistol') this.ammo+=30;
		if(this.type=='rifle') this.ammo+=60;
		if(this.type=='rpg') this.ammo+=5;
	}
	toJSON(){
		return {
			class: "Weapon",
			data: {
				type: this.type,
				ammo: this.ammo
			}
		}
	}
	addAmmo(){
		if(this.type=='fist') return;
		if(this.type=='pistol'){
			this.ammo+=20;
		} 
		if(this.type=='rifle'){
			this.ammo+=40;
		}
		if(this.type=='rpg'){
			this.ammo+=3;
		}
	}
	update(){
		if(this.type=='fist') this.fireCD=15;
		if(this.type=='pistol'){
			this.ammo--;
			this.fireCD=20;
		}
		if(this.type=='rifle'){
			this.ammo--;
			this.fireCD=5;
		}
		if(this.type=='rpg'){
			this.ammo--;
			this.fireCD=40;	
		}
	}
}
class Player extends Ball {
	constructor(stage, id, position, velocity, colour, radius){
		super(stage, position, velocity, colour, radius);
		this.id=id;
		this.health=100;
		this.aim_target = new Pair(position.x, position.y-1);
		this.beingHit = false;
		this.weapons=[];
		this.addWeapon('fist');
		this.addWeapon('pistol');
		this.addWeapon('rifle');
		this.addWeapon('rpg');
		this.weaponIdx=0;
		this.points=0;
		this.deathCD=0;
		this.hitCD=0;
		this.msg="None";
		this.msgCD=0;
		this.outsideCircle=false;
	}
	toJSON(){
		return {
			class: "Player",
			data: {
				id: this.id,
				position: this.position.toJSON(),
				velocity: this.velocity.toJSON(),
				colour: this.colour,
				radius: this.radius,
				aimTarget: this.aim_target.toJSON(),
				beingHit: this.beingHit,
				weapon: this.weapons[this.weaponIdx].toJSON(),
				points: this.points,
				health: this.health,
				msg: this.msg
			}
		}
	}
	switchWeapon(){
		this.weaponIdx++;
		this.stage.updateChanged(true);
		if(this.weaponIdx>=this.weapons.length) this.weaponIdx=0;
	}
	addWeapon(weapon){
		for(var i=0;i<this.weapons.length;i++){
			if(this.weapons[i].type==weapon) {
				this.weapons[i].addAmmo();
				return;
			}
		}
		var newWeapon=new Weapon(this, weapon);
		this.weapons.push(newWeapon);
	}
	pickup(){
		for(var i=0;i<this.stage.actors.length;i++){
			if(this.stage.actors[i] instanceof Item){
				var distX=this.stage.actors[i].position.x-this.position.x;
				var distY=this.stage.actors[i].position.y-this.position.y;
				if(Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius){
					this.stage.actors[i].beingPicked=true;
					if(this.stage.actors[i].type=='first-aid'){
						this.health+=20;
						if(this.health>100) this.health=100;
					}
					if(this.stage.actors[i].type=='ammo'){
						for(var j=0;j<this.weapons.length;j++){
							this.weapons[j].addAmmo();
						}
					} 
					if(this.stage.actors[i].type=='pistol') this.addWeapon('pistol');
					if(this.stage.actors[i].type=='rifle') this.addWeapon('rifle');
					if(this.stage.actors[i].type=='rpg') this.addWeapon('rpg');
					this.stage.updateChanged(true);
					return;
				}
			}
		}
	}
	aim(target){ 
		var x=this.position.x;
		var y=this.position.y;
		if(target.x==x&&target.y==y){
			this.aim_target = new Pair(x, y-1);
		}else{
			this.aim_target = target;
		}
		this.stage.updateChanged(true);
	}
	fireWeapon() {
		var weapon = this.weapons[this.weaponIdx];
		if(weapon.fireCD==0){ // player can only attack or fire iff weapon's cool down is 0
			var x1=this.position.x;
			var y1=this.position.y;
			var targetX=this.aim_target.x;
			var targetY=this.aim_target.y;
			if(weapon.type=='fist'){
				for(var i=0;i<this.stage.actors.length;i++){
					if((this.stage.actors[i] instanceof Player)&&(this.stage.actors[i].id!=this.id) ){
						var distX=this.stage.actors[i].position.x-x1;
						var distY=this.stage.actors[i].position.y-y1;
						var distTargetX=this.stage.actors[i].position.x-targetX;
						var distTargetY=this.stage.actors[i].position.y-targetY;
						if((Math.sqrt(distX*distX+distY*distY)<=this.radius+this.stage.actors[i].radius)&&
							(Math.sqrt(distTargetX*distTargetX+distTargetY*distTargetY)<=this.stage.actors[i].radius)){
							this.stage.actors[i].beingHit=true;
							this.stage.actors[i].health-=10;
						}
					}
					if(this.stage.actors[i] instanceof Obstacle){
						var recX=this.stage.actors[i].position.x;
						var recY=this.stage.actors[i].position.y;
						var xRange=recX+this.stage.actors[i].width;
						var yRange=recY+this.stage.actors[i].height;
						if(((recY-this.radius-2<y1&&y1<yRange+this.radius+2)&&
							(recX-this.radius-2<x1&&x1<xRange+this.radius+2))&&
							(recX<=targetX&&targetX<=xRange&&recY<=targetY&&targetY<=yRange)){
							this.stage.actors[i].beingHit=true;
							this.stage.actors[i].health-=10;
						}
					}	
				}
				this.weapons[this.weaponIdx].update();
			}
			if(weapon.type=='pistol'&&weapon.ammo>0){
				var x2=(40*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
				var y2=(40*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
				var position = new Pair(x2,y2);
				var x3=12*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)
						+(targetY-y1)*(targetY-y1));
				var y3=12*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)
						+(targetY-y1)*(targetY-y1));
				var velocity=new Pair(x3, y3);
				var colour='rgba(221,60,12,1)';
				var radius=5;
				var type='level1';
				this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, this));
				this.weapons[this.weaponIdx].update();
			}
			if(weapon.type=='rifle'&&weapon.ammo>0){
				var x2=(45*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
				var y2=(45*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
				var position = new Pair(x2,y2);
				var x3=14*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)
					+(targetY-y1)*(targetY-y1));
				var y3=14*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)
					+(targetY-y1)*(targetY-y1));
				var velocity=new Pair(x3, y3);
				var colour='rgba(221,60,12,1)';
				var radius=5;
				var type='level2';
				this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, this));
				this.weapons[this.weaponIdx].update();
			}
			if(weapon.type=='rpg'&&weapon.ammo>0){
				var x2=(45*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
				var y2=(45*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
				var position = new Pair(x2,y2);
				var x3=10*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)
					+(targetY-y1)*(targetY-y1));
				var y3=10*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)
					+(targetY-y1)*(targetY-y1));
				var velocity=new Pair(x3, y3);
				var colour='rgba(221,60,12,1)';
				var radius=8;
				var type='level3';
				this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, this));
				this.weapons[this.weaponIdx].update();
			}
			this.stage.updateChanged(true);
		}
	}
	updateWeaponCD(){
		for(var i=0;i<this.weapons.length;i++){
			this.weapons[i].fireCD--;
			if(this.weapons[i].fireCD<0){
				this.weapons[i].fireCD=0;
			}
		}
	}
	step(){
		this.stage.updateChanged(true);
		if(Math.sqrt((this.position.x-this.stage.currCircleCentre.x)**2+
		(this.position.y-this.stage.currCircleCentre.y)**2)>Math.abs(this.stage.currCircleRadius-this.radius)){
			this.outsideCircle=true;
		}else{
			this.outsideCircle=false;
		}
		if(this.health<0){
			this.health=0;
		}
		if(this.health==0){
			if(this.deathCD%2==0){
				this.beingHit=true;
			}else{
				this.beingHit=false;
			}
			this.deathCD++;
			if(this.deathCD==20){
				this.stage.removePlayer(this);
			}
			return;
		}
		if(this.beingHit){
			if(this.hitCD==2){
				this.beingHit=false;
				this.hitCD=0;
			}
			this.hitCD++;
		}
		if(this.health>0){
			this.msgCD++;
			if(this.msgCD==100){
				this.msg='None';
				this.msgCD=0;
			}
			this.updateWeaponCD();
			this.position.x+=this.velocity.x;
			this.position.y+=this.velocity.y;
			for(var i=0;i<this.stage.actors.length;i++){
				if(this.stage.actors[i] instanceof Obstacle){	
					var x=this.stage.actors[i].position.x;
					var y=this.stage.actors[i].position.y;
					var xRange=x+this.stage.actors[i].width;
					var yRange=y+this.stage.actors[i].height;
					if((y-this.radius<this.position.y&&this.position.y<yRange+this.radius)&&
						(x-this.radius<this.position.x&&this.position.x<xRange+this.radius)){
						if(this.position.y>yRange){
							this.position.y=yRange+this.radius;
						}else if(this.position.y<y){
							this.position.y=y-this.radius;
						}else if(this.position.x>xRange){
							this.position.x=xRange+this.radius;
						}else if(this.position.x<x){
							this.position.x=x-this.radius;
						}	
					}
				}
			}
			if(this.position.x<0){
				this.position.x=0;
			}
			if(this.position.x>this.stage.mapWidth){
				this.position.x=this.stage.mapWidth;
			}
			if(this.position.y<0){
				this.position.y=0;
			}
			if(this.position.y>this.stage.mapHeight){
				this.position.y=this.stage.mapHeight;
			}
			return;
		}	
	}
}
class Bot extends Player {
	constructor(stage, id, position, velocity, colour, radius, type){
		super(stage, id, position, velocity, colour, radius);
		this.type=type;
		this.health=100;
		this.weapon='fist';
		if(this.type=='level2') this.weapon='rifle';
		if(this.type=='level3') {
			this.health=100; 
			this.weapon='rpg';
		}
		this.aim_target = new Pair(0, 0);  // Aim position which indicates the map position 
										   // where the aim crosshair is pointed at. 
		this.beingHit = false;
		this.hitCD;
		this.fireCD=0;
		this.deathCD=0;
		this.detectRange=800;
		this.outsideCircle=false;
	}
	toJSON() {
		return {
			class: "Bot",
			data: {
				id: this.id,
				position: this.position.toJSON(),
				velocity: this.velocity.toJSON(),
				colour: this.colour,
				radius: this.radius,
				aimTarget: this.aim_target.toJSON(),
				beingHit: this.beingHit,
				weapon: this.weapon,
				health: this.health,
				type: this.type
			}
		}

	}
	aim(target){
		var x=this.position.x;
		var y=this.position.y;
		if(target.x==x&&target.y==y){
			this.aim_target = new Pair(x, y-1);
		}else{
			this.aim_target = target;
		}	
	}
	fireWeapon(actor) {
		var x1=this.position.x;
		var y1=this.position.y;
		if(this.fireCD==0){
			if(this.weapon=='fist'){
				var distX=actor.position.x-x1;
				var distY=actor.position.y-y1;
				if(Math.sqrt(distX*distX+distY*distY)<=this.radius+actor.radius){
					if(actor.health>0){
						actor.beingHit=true;
						actor.health-=10;
					}
				}
				this.fireCD=30+randint(10);
				return;
			}
			var targetX = this.aim_target.x;
			var targetY = this.aim_target.y;
			if(this.weapon=='rifle'){
				var x2=(45*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
				var y2=(45*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
				var position = new Pair(x2,y2);
				var x3=14*(targetX-position.x)/Math.sqrt((targetX-position.x)*(targetX-position.x)
					+(targetY-position.y)*(targetY-position.y));
				var y3=14*(targetY-position.y)/Math.sqrt((targetX-position.x)*(targetX-position.x)
					+(targetY-position.y)*(targetY-position.y));
				var velocity=new Pair(x3, y3);
				var colour='rgba(221,60,12,1)';
				var radius=5;
				var fireFrom=this;
				var type='level2';
				this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, fireFrom));
				this.fireCD=20+randint(10);
				return;
			}
			if(this.weapon=='rpg'){
				var x2=(45*(targetX-x1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+x1;
				var y2=(45*(targetY-y1)/Math.sqrt((targetX-x1)*(targetX-x1)+(targetY-y1)*(targetY-y1)))+y1;
				var position = new Pair(x2,y2);
				var x3=10*(targetX-position.x)/Math.sqrt((targetX-position.x)*(targetX-position.x)
					+(targetY-position.y)*(targetY-position.y));
				var y3=10*(targetY-position.y)/Math.sqrt((targetX-position.x)*(targetX-position.x)
					+(targetY-position.y)*(targetY-position.y));
				var velocity=new Pair(x3, y3);
				var colour='rgba(221,60,12,1)';
				var radius=8;
				var fireFrom=this;
				var type='level3';
				this.stage.addActor(new Bullet(this.stage, position, velocity, colour, radius, type, fireFrom));
				this.fireCD=50+randint(10);
				return;
			}
		}
	}
	step(){
		this.stage.updateChanged(true);
		if(Math.sqrt((this.position.x-this.stage.currCircleCentre.x)**2+
		(this.position.y-this.stage.currCircleCentre.y)**2)>Math.abs(this.stage.currCircleRadius-this.radius)){
			this.outsideCircle=true;
		}else{
			this.outsideCircle=false;
		}
		if(this.health<0){
			this.health=0;
		}
		if(this.health==0){
			if(this.deathCD%2==0){
				this.beingHit=true;
			}else{
				this.beingHit=false;
			}
			this.deathCD++;
			if(this.deathCD==20){
				this.stage.removePlayer(this);
			}
			return;
		}
		if(this.beingHit){
			if(this.hitCD==2){
				this.beingHit=false;
				this.hitCD=0;
			}
			this.hitCD++;
		}
		if(this.health>0){
			this.position.x+=this.velocity.x;
			this.position.y+=this.velocity.y;
			for(var i=0;i<this.stage.actors.length;i++){
				if(this.stage.actors[i] instanceof Obstacle){
					var x=this.stage.actors[i].position.x;
					var y=this.stage.actors[i].position.y;
					var xRange=x+this.stage.actors[i].width;
					var yRange=y+this.stage.actors[i].height;
					if((y-this.radius<this.position.y&&this.position.y<yRange+this.radius)&&
						(x-this.radius<this.position.x&&this.position.x<xRange+this.radius)){
						if(this.position.y>yRange){
							this.position.y=yRange+this.radius;
							this.velocity.y=Math.abs(this.velocity.y);
						}else if(this.position.y<y){
							this.position.y=y-this.radius;
							this.velocity.y=-Math.abs(this.velocity.y);
						}else if(this.position.x>xRange){
							this.position.x=xRange+this.radius;
							this.velocity.x=Math.abs(this.velocity.x);
						}else if(this.position.x<x){
							this.position.x=x-this.radius;
							this.velocity.x=-Math.abs(this.velocity.x);
						}	
					}
				}
			}
			// bounce off the walls
			if(this.position.x<0){
				this.position.x=0;
				this.velocity.x=Math.abs(this.velocity.x);
			}
			if(this.position.x>this.stage.mapWidth){
				this.position.x=this.stage.mapWidth;
				this.velocity.x=-Math.abs(this.velocity.x);
			}
			if(this.position.y<0){
				this.position.y=0;
				this.velocity.y=Math.abs(this.velocity.y);
			}
			if(this.position.y>this.stage.mapHeight){
				this.position.y=this.stage.mapHeight;
				this.velocity.y=-Math.abs(this.velocity.y);
			}
			
			// update fireCD
			this.fireCD--;
			if(this.fireCD<0){
				this.fireCD=0;
			}

			for(var i=0;i<this.stage.actors.length;i++){
				if(this.stage.actors[i] instanceof Bot&&this.stage.actors[i].id!=this.id){
					var distX=this.stage.actors[i].position.x-this.position.x;
					var distY=this.stage.actors[i].position.y-this.position.y;
					var dist=Math.sqrt(distX*distX+distY*distY);
					if(dist<=this.detectRange&&this.stage.actors[i].health>0){	// player within the enemy's detect range
						this.aim(this.stage.actors[i].position);
						this.headTo(this.stage.actors[i].position);
						this.fireWeapon(this.stage.actors[i]);
						break;
					}
				}
				if((this.stage.actors[i] instanceof Player)&&!(this.stage.actors[i] instanceof Bot)){
					var distX=this.stage.actors[i].position.x-this.position.x;
					var distY=this.stage.actors[i].position.y-this.position.y;
					var dist=Math.sqrt(distX*distX+distY*distY);
					if(dist<=this.detectRange&&this.stage.actors[i].health>0){	// player within the enemy's detect range
						this.aim(this.stage.actors[i].position);
						this.headTo(this.stage.actors[i].position);
						this.fireWeapon(this.stage.actors[i]);
						break;
					}
				}
			}
		}
	}
}
module.exports = Stage;