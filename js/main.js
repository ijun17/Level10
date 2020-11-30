//import Player from "Player.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function keyDownHandler(e) {
    if(e.keyCode == 39) {//right
        p.goRight();
    }else if(e.keyCode == 37) {//left
        p.goLeft();
    }else if(e.keyCode == 38){//up
        p.jump();
    }else if(e.keyCode == 40){//down
        p.setVectorY(-2.5);
    }else if(e.keyCode == 81 &&p.qCT<time){ //q
        p.qCT=time+50;
        var bullet;
        var temp=-1;
        if(p.isRight)temp=1;
        for(var i=0; i<3; i++){
            bullet = new Block(p.x+30*temp, p.y+i*14, 10,10);
            bullet.setVectorX(30*temp);
            bullet.life=50;
        }
        

        bullet.setMass(10);
    }
    else if(e.keyCode == 87 &&p.wCT<time){ //w
        p.wCT=time+200;
        var ice;
        var temp=-1;
        if(p.isRight)temp=1;
        ice=new Matter(2,p.x+30*temp, p.y, 10*temp, 0.5);
    }
    else if(e.keyCode == 69 &&p.eCT<time){ //e
        p.eCT=time+100;
        var temp=-1;
        if(p.isRight)temp=1;
        p.x+=300*temp;
    }else if(e.keyCode == 82 &&p.rCT<time){ //r
        p.rCT=time+1000;
        
        
        p.addAction(1,70,function(){
            var temp=-1;
            if(p.isRight)temp=1;
            ice=new Matter(1,p.x+40*temp, p.y+20, 15*temp, 0.5);
        })
        
    }

}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        p.setVectorX(0);
    }
    else if(e.keyCode == 37) {
        p.setVectorX(0);
    }
}
function clickHandler(e){
    var click = new Block(e.layerX, e.layerY, 0, 0);
    click.life=1;
    click.overlap=true;
}


function startWorld(){
    Game.startGame();
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    canvas.addEventListener("click", clickHandler, false);
}

startWorld();
setInterval(Game.updateWorld, 10);