export function drawInfo(player, playerNum, context, width, height){
    context.fillStyle = 'rgba(0,0,0,1)';
	context.font='bold 22px Arial';
    var x=width;
    var y=height;
    if(width>=height){
        x=width*0.8;
        y=height*0.1;
        var wx=width*0.15;
        var wy=height*0.2;
    }else{
        x=width*0.6;
        y=height*0.1;
        var wx=width*0.35;
        var wy=height*0.2;
    }
    if(player.msg!=='None'){
        context.fillStyle= 'rgba(228,65,65,1)';
        context.font='bold 26px Arial';
        context.fillText(player.points, width*0.45, height*0.4);
        context.fillStyle = 'rgba(0,0,0,1)';
        context.fillText('Kill', width*0.48, height*0.4);
        context.font='bold 22px Arial';
        context.fillText(player.msg+' !', width*0.45, height*0.45);
    }
    context.fillStyle = 'rgba(0,0,0,1)';
	context.font='bold 22px Arial';
    if(player.health<=0){
        context.fillText("You Died!", width*0.45, height*0.45);
    }
    context.fillText('Killed: '+player.points, width*0.015,  y-height*0.034);
    context.fillText('Remaining: '+playerNum, width*0.015,  y+height*0.015);
    context.fillText('Health:', x-width*0.04, y-height*0.032);
    var len=Math.round(wx*0.8*(player.health/100));
    context.fillStyle='rgba(228,65,65,1)';
    context.fillRect(x+wx*0.27, y-height*0.07, len, y*0.5);
	context.fillStyle='rgba(0,0,0,1)';
	context.lineWidth=2;
	context.strokeRect(x+wx*0.27, y-height*0.072, wx*0.8, y*0.52);
    if(player.weapon.data.type=='fist'){
        var fist=document.getElementById('fist');
		context.drawImage(fist, x+wx*0.38, y+wy*0.1, wx*0.24, wx*0.24);
    }
    if(player.weapon.data.type=='pistol'){
        var pistol=document.getElementById('pistol');
        context.drawImage(pistol, x+wx*0.34, y+wy*0.1, wx*0.32, wx*0.32*0.9);

    }
    if(player.weapon.data.type=='rifle'){
        var rifle=document.getElementById('rifle');
        context.drawImage(rifle, x+wx*0.15, y+wy*0.1, 0.7*wx, 0.7*wx*0.35);
    }
    if(player.weapon.data.type=='rpg'){
        var rpg=document.getElementById('rpg');
        context.drawImage(rpg, x+wx*0.32, y+wy*0.1, wx*0.36, wx*0.36);
    }
    var ammo=document.getElementById('ammo');
    context.drawImage(ammo, x+wx*0.25, y+wy*0.6, wx*0.25, wx*0.25*0.9);
    context.fillText(player.weapon.data.ammo, x+wx*0.5, y+wy*0.8);
    context.lineWidth=2;
    context.strokeRect(x, y, wx, wy);
}


export function drawObj(val, context, basex, basey){
    var obj=val.data;
    var x = Math.round(obj.position.x+basex);
	var y = Math.round(obj.position.y+basey);	
    if(val.class==="Obstacle"){
		if(obj.beingHit){  // being hit
			context.fillStyle = 'rgba(174,0,0,1)';
		}else{  // otherwise
			context.fillStyle=obj.colour;
		}		
		context.fillRect(x, y, obj.width, obj.height);
		context.beginPath(); 
		context.lineWidth=5;
		context.strokeRect(x, y, obj.width, obj.height);
    }
    if(val.class==="Bullet"){
		context.fillStyle=obj.colour;
		context.beginPath(); 
		context.arc(x, y, obj.radius, 0, 2 * Math.PI, false); 
		context.fill();
    }
    if(val.class==="Explosive"){
        context.fillStyle=obj.colour;
        context.beginPath(); 
        context.arc(x, y, obj.radius, 0, 2 * Math.PI, false); 
        context.fill();
    }
    if(val.class==="Item"){
		if(obj.type==='first-aid'){
    		context.lineWidth = 2;
    		context.fillStyle = 'rgba(255,0,0,1)';
			var k=x-16;
			context.beginPath();
    		context.moveTo(k, y);
    		context.quadraticCurveTo(k, y-8, k+8, y-8);
    		context.quadraticCurveTo(k+16, y-8, k+16, y);
    		context.quadraticCurveTo(k+16, y-8, k+24, y-8);
    		context.quadraticCurveTo(k+32, y-8, k+32, y);
    		context.quadraticCurveTo(k+32, y+8, k+24, y+16);
    		context.lineTo(k+16, y+24);
    		context.lineTo(k+8, y+16);
    		context.quadraticCurveTo(k, y+8, k, y);
    		context.stroke();
    		context.fill();
		}
		if(obj.type=='ammo'){
			var ammo=document.getElementById('ammo');
			context.drawImage(ammo, x-20, y-20, 40, 40);
		}
		if(obj.type=='pistol'){
			var pistol=document.getElementById('pistol');
			context.drawImage(pistol, x-25, y-20, 50, 40);
		}
		if(obj.type=='rifle'){
			var rifle=document.getElementById('rifle');
			context.drawImage(rifle, x-50, y-20, 100, 40);
		}
		if(obj.type=='rpg'){
			var rpg=document.getElementById('rpg');
			context.drawImage(rpg, x-25, y-25, 50, 50);
		}
    }
}

export function drawBot(val, context, basex, basey){
    var player=val.data;
    if(player.beingHit){
        context.fillStyle = 'rgba(174,0,0,1)';
    }else{
        context.fillStyle=player.colour;
    }
    var x1=player.position.x+basex;
    var y1=player.position.y+basey
    var x=Math.round(x1);
    var y=Math.round(y1);
    var aimX=player.aimTarget.x+basex;
    var aimY=player.aimTarget.y+basey;
    if(player.weapon==='fist'){
        var dist=Math.sqrt((aimX-x1)*(aimX-x1)+(aimY-y1)*(aimY-y1));
        var cos=Math.abs(aimX-x1)/dist;
        var sin=Math.abs(aimY-y1)/dist;
        var mag=Math.abs((Math.sqrt(2)/2)*(cos-sin));
        var mag2=Math.abs((Math.sqrt(2)/2)*(cos+sin));
        var deltaY=mag*player.radius;
        var deltaX=mag2*player.radius;
        var x2=0.0, y2=0.0, x3=0.0, y3=0.0;
        if(aimX<=x1&&aimY<=y1){
            if(sin>=cos){
                x2=x1-deltaX;
                y2=y1-deltaY;
                x3=x1+deltaY;
                y3=y1-deltaX;
            }else{
                x2=x1-deltaX;
                y2=y1+deltaY;
                x3=x1-deltaY;
                y3=y1-deltaX;
            }
        }
        if(aimX>=x1&&aimY<=y1){
            if(sin>=cos){
                x2=x1-deltaY;
                y2=y1-deltaX;
                x3=x1+deltaX;
                y3=y1-deltaY;
            }else{
                x2=x1+deltaY;
                y2=y1-deltaX;
                x3=x1+deltaX;
                y3=y1+deltaY;		
            }
        }
        if(aimX>=x1&&aimY>=y1){
            if(sin>=cos){
                x2=x1+deltaX;
                y2=y1+deltaY;
                x3=x1-deltaY;
                y3=y1+deltaX;
            }else{
                x2=x1+deltaX;
                y2=y1-deltaY;
                x3=x1+deltaY;
                y3=y1+deltaX;
            }
        }
        if(aimX<=x1&&aimY>=y1){
            if(sin>=cos){
                x2=x1+deltaY;
                y2=y1+deltaX;
                x3=x1-deltaX;
                y3=y1+deltaY;
            }else{
                x2=x1-deltaY;
                y2=y1+deltaX;
                x3=x1-deltaX;
                y3=y1-deltaY;	
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
    }
    if(player.weapon==='pistol'){
        var x2=(40*(aimX-x1)/Math.sqrt((aimX-x1)*(aimX-x1)+(aimY-y1)*(aimY-y1)))+x1;
        var y2=(40*(aimY-y1)/Math.sqrt((aimX-x1)*(aimX-x1)+(aimY-y1)*(aimY-y1)))+y1;
        context.lineWidth=5;
        context.beginPath();
        context.moveTo(Math.round(x1), Math.round(y1));
        context.lineTo(Math.round(x2), Math.round(y2));
        context.stroke();
        context.beginPath();
        context.arc(x, y, player.radius, 0, 2 * Math.PI, false); 
        context.fill();
        context.lineWidth=2;
        context.stroke();
       
            context.fillStyle = 'rgba(0,0,0,1)';
            context.font='bold 15px Arial';
            context.fillText('Bot '+player.id, x-1.4*player.radius,  y-2.4*player.radius);
            var len=Math.round(player.radius*4*(player.health/100));
            context.fillStyle='rgba(228,65,65,1)';
            context.fillRect(x-2*player.radius, y-2*player.radius, len, player.radius*0.5);
            context.fillStyle='rgba(0,0,0,1)';
            context.strokeRect(x-2.01*player.radius, y-2.01*player.radius, player.radius*4,  player.radius*0.5);
        
        return;
    }
    context.beginPath();
    context.arc(x, y, player.radius, 0, 2 * Math.PI, false); 
    context.fill();
    context.lineWidth=2;
    context.stroke();
   
        context.fillStyle = 'rgba(0,0,0,1)';
        context.font='bold 15px Arial';
        context.fillText('Bot '+player.id, x-1.4*player.radius,  y-2.2*player.radius);
        var len=Math.round(player.radius*4*(player.health/100));
        context.fillStyle='rgba(228,65,65,1)';
        context.fillRect(x-2*player.radius, y-1.8*player.radius, len, player.radius*0.5);
        context.fillStyle='rgba(0,0,0,1)';
        context.strokeRect(x-2.01*player.radius, y-1.81*player.radius, player.radius*4,  player.radius*0.5);
    

    if(player.weapon==='rifle'){
        var x2=(45*(aimX-x1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+x1;
        var y2=(45*(aimY-y1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+y1;
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(Math.round(x1), Math.round(y1));
        context.lineTo(Math.round(x2), Math.round(y2));
        context.stroke();
    }
    if(player.weapon==='rpg'){
        var x2=(45*(aimX-x1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+x1;
        var y2=(45*(aimY-y1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+y1;
        var x3=((x1-aimX)*player.radius/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+x1;
        var y3=((y1-aimY)*player.radius/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+y1;
        context.lineWidth = 8;
        context.beginPath();
        context.moveTo(Math.round(x3), Math.round(y3));
        context.lineTo(Math.round(x2), Math.round(y2));
        context.strokeStyle='#1b6309';
        context.stroke();
        context.strokeStyle='#000000';
    }
}

export function drawPlayer(id, val, context, basex, basey){
    var player=val.data;
    if(player.beingHit){
        context.fillStyle = 'rgba(174,0,0,1)';
    }else{
        context.fillStyle=player.colour;
    }
    var x1=player.position.x+basex;
    var y1=player.position.y+basey
    var x=Math.round(x1);
    var y=Math.round(y1);
    var aimX=player.aimTarget.x+basex;
    var aimY=player.aimTarget.y+basey;
    if(player.weapon.data.type==='fist'){
        var dist=Math.sqrt((aimX-x1)*(aimX-x1)+(aimY-y1)*(aimY-y1));
        var cos=Math.abs(aimX-x1)/dist;
        var sin=Math.abs(aimY-y1)/dist;
        var mag=Math.abs((Math.sqrt(2)/2)*(cos-sin));
        var mag2=Math.abs((Math.sqrt(2)/2)*(cos+sin));
        var deltaY=mag*player.radius;
        var deltaX=mag2*player.radius;
        var x2=0.0, y2=0.0, x3=0.0, y3=0.0;
        if(aimX<=x1&&aimY<=y1){
            if(sin>=cos){
                x2=x1-deltaX;
                y2=y1-deltaY;
                x3=x1+deltaY;
                y3=y1-deltaX;
            }else{
                x2=x1-deltaX;
                y2=y1+deltaY;
                x3=x1-deltaY;
                y3=y1-deltaX;
            }
        }
        if(aimX>=x1&&aimY<=y1){
            if(sin>=cos){
                x2=x1-deltaY;
                y2=y1-deltaX;
                x3=x1+deltaX;
                y3=y1-deltaY;
            }else{
                x2=x1+deltaY;
                y2=y1-deltaX;
                x3=x1+deltaX;
                y3=y1+deltaY;		
            }
        }
        if(aimX>=x1&&aimY>=y1){
            if(sin>=cos){
                x2=x1+deltaX;
                y2=y1+deltaY;
                x3=x1-deltaY;
                y3=y1+deltaX;
            }else{
                x2=x1+deltaX;
                y2=y1-deltaY;
                x3=x1+deltaY;
                y3=y1+deltaX;
            }
        }
        if(aimX<=x1&&aimY>=y1){
            if(sin>=cos){
                x2=x1+deltaY;
                y2=y1+deltaX;
                x3=x1-deltaX;
                y3=y1+deltaY;
            }else{
                x2=x1-deltaY;
                y2=y1+deltaX;
                x3=x1-deltaX;
                y3=y1-deltaY;	
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
    }
    if(player.weapon.data.type==='pistol'){
        var x2=(40*(aimX-x1)/Math.sqrt((aimX-x1)*(aimX-x1)+(aimY-y1)*(aimY-y1)))+x1;
        var y2=(40*(aimY-y1)/Math.sqrt((aimX-x1)*(aimX-x1)+(aimY-y1)*(aimY-y1)))+y1;
        context.lineWidth=5;
        context.beginPath();
        context.moveTo(Math.round(x1), Math.round(y1));
        context.lineTo(Math.round(x2), Math.round(y2));
        context.stroke();
        context.beginPath();
        context.arc(x, y, player.radius, 0, 2 * Math.PI, false); 
        context.fill();
        context.lineWidth=2;
        context.stroke();
        if(player.id!==id){
            context.fillStyle = 'rgba(0,0,0,1)';
            context.font='bold 15px Arial';
            context.fillText('Player '+player.id, x-1.4*player.radius,  y-2.4*player.radius);
            var len=Math.round(player.radius*4*(player.health/100));
            context.fillStyle='rgba(228,65,65,1)';
            context.fillRect(x-2*player.radius, y-2*player.radius, len, player.radius*0.5);
            context.fillStyle='rgba(0,0,0,1)';
            context.strokeRect(x-2.01*player.radius, y-2.01*player.radius, player.radius*4,  player.radius*0.5);
        }
        return;
    }
    context.beginPath();
    context.arc(x, y, player.radius, 0, 2 * Math.PI, false); 
    context.fill();
    context.lineWidth=2;
    context.stroke();
    if(player.id!==id){
        context.fillStyle = 'rgba(0,0,0,1)';
        context.font='bold 15px Arial';
        context.fillText('Player '+player.id, x-1.4*player.radius,  y-2.2*player.radius);
        var len=Math.round(player.radius*4*(player.health/100));
        context.fillStyle='rgba(228,65,65,1)';
        context.fillRect(x-2*player.radius, y-1.8*player.radius, len, player.radius*0.5);
        context.fillStyle='rgba(0,0,0,1)';
        context.strokeRect(x-2.01*player.radius, y-1.81*player.radius, player.radius*4,  player.radius*0.5);
    }

    if(player.weapon.data.type==='rifle'){
        var x2=(45*(aimX-x1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+x1;
        var y2=(45*(aimY-y1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+y1;
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(Math.round(x1), Math.round(y1));
        context.lineTo(Math.round(x2), Math.round(y2));
        context.stroke();
    }
    if(player.weapon.data.type==='rpg'){
        var x2=(45*(aimX-x1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+x1;
        var y2=(45*(aimY-y1)/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+y1;
        var x3=((x1-aimX)*player.radius/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+x1;
        var y3=((y1-aimY)*player.radius/Math.sqrt((aimX-x1)*(aimX-x1)
            +(aimY-y1)*(aimY-y1)))+y1;
        context.lineWidth = 8;
        context.beginPath();
        context.moveTo(Math.round(x3), Math.round(y3));
        context.lineTo(Math.round(x2), Math.round(y2));
        context.strokeStyle='#1b6309';
        context.stroke();
        context.strokeStyle='#000000';
    }
}
