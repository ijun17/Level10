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
    }else if(e.keyCode == 81){ //q
        var bullet;
        var temp=-1;
        if(p.isRight)temp=1;
        bullet = new Block(p.x+30*temp, p.y+p.h/2, 10,10);
        bullet.setVectorX(30*temp);
        //bullet.setVectorY(-10);
        bullet.setMass(10);
    }
    else if(e.keyCode == 87){ //w
        var wall;
        var temp=-1;
        if(p.isRight)temp=1;
        wall = new Block(p.x+30*temp, p.y-60, 10,60);
        wall.setLife(2000);
        //fire.setVectorX(5*temp);
    }
    else if(e.keyCode == 69){ //e
        p.addAction(1,1000,function(){p.canJump=true;});
    }else if(e.keyCode == 82){ //r
        var ice;
        var temp=-1;
        if(p.isRight)temp=1;
        ice=new Matter(2,p.x+30*temp, p.y, 10*temp, 0.5);
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