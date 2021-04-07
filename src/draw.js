export function drawObj(val, context, basex, basey){
    if(val.class==="Obstacle"){
        var obj=val.data;
		if(obj.beingHit){  // being hit
			context.fillStyle = 'rgba(174,0,0,1)';
		}else{  // otherwise
			context.fillStyle=obj.colour;
		}	
		var x = Math.round(obj.position.x+basex);
		var y = Math.round(obj.position.y+basey);	
		context.fillRect(x, y, obj.width, obj.height);
		context.beginPath(); 
		context.lineWidth=5;
		context.strokeRect(x, y, obj.width, obj.height);
    }
}

export function drawPlayer(val, context, basex, basey){
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
    if(player.weapons[player.weaponIdx].data.type==='fist'){
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
    if(player.weapons[player.weaponIdx].data.type==='pistol'){
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
        return;
    }
    context.beginPath();
    context.arc(x, y, player.radius, 0, 2 * Math.PI, false); 
    context.fill();
    context.lineWidth=2;
    context.stroke();
    if(player.weapons[player.weaponIdx].data.type==='rifle'){
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
    if(player.weapons[player.weaponIdx].data.type==='rpg'){
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

