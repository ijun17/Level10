//import Player from "Player.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function keyDownHandler(e) {
    if(e.keyCode == 39) {//right
        p.goRight();
    }
    else if(e.keyCode == 37) {//left
        p.goLeft();
    }else if(e.keyCode == 38 && p.vy<=p.ga){//up
        p.setVectorY(2.5);
    }
    else if(e.keyCode == 40){//down
        p.setVectorY(-2.5);
    }else if(e.keyCode == 81){ //q
        var fire;
        var temp=-1;
        if(p.isRight)temp=1;
        fire=new Matter(0,p.x+30*temp, p.y, 5*temp, 0.5);
    }
    else if(e.keyCode == 87){ //w
        var wall;
        var temp=-1;
        if(p.isRight)temp=1;
        wall = new Block(p.x+50*temp, p.y-60, 10,60);
        wall.setLife(2000);
        //fire.setVectorX(5*temp);
    }
    else if(e.keyCode == 69){ //e
        var arrow;
        var temp=-1;
        if(p.isRight)temp=1;
        arrow=new Matter(4,p.x+30*temp, p.y, 5*temp, 0.5);
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

function updateWorld(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var e of entitys){e.update();}
    if(time++%100==0)console.log(time);
}

function startWorld(){
    ctx.translate(0,-50);

    new MapBlock(-10,0,10,canvas.height); //left
    new MapBlock(canvas.width,0,10,canvas.height);//right
    new MapBlock(0,-10,canvas.width,10);//top
    new MapBlock(0,canvas.height,canvas.width,10,"#2B650D");//bottom
    new MapBlock(0,canvas.height+10,canvas.width,40,"#54341E");

    new MapBlock(100, canvas.height-60, 100, 20);

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    p = new Player(10,canvas.height-30);
    new Player(300,200);
    new Monster(0,700, 200);
    new Monster(1,500, 200);
}

startWorld();
setInterval(updateWorld, 10);