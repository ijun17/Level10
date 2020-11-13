//import Player from "Player.js";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var rightPressed = false;
var leftPressed = false;
const pv = 2;

function keyDownHandler(e) {
    if(e.keyCode == 39) {//right
        p.setVectorX(pv);
        p.setImage(`resource/player_right.png`);
    }
    else if(e.keyCode == 37) {//left
        p.setVectorX(-pv);
        p.setImage(`resource/player_left.png`);
    }
    else if(e.keyCode == 38 && p.y>canvas.height-30){//up
        p.setVectorY(2);
    }
    else if(e.keyCode == 40){//down
        p.setVectorY(-2);
    }
    else if(e.keyCode == 81){
        var fire = new Effect(p.x+30, p.y, "fire");
        fire.setVectorX(5);
        fire.setVectorY(0.5);
        fire.setGravity(0.02);
    }
    else if(e.keyCode == 87){
        var fire = new Effect(p.x+30, p.y, "lightning");
        fire.setVectorX(5);
        fire.setVectorY(0.5);
        fire.setGravity(0.02);
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

function drawWorld(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var e of entitys){
        e.draw();
    }
    
}

ctx.translate(0,-50);

ctx.beginPath();
ctx.rect(0, canvas.height, canvas.width, 50);
ctx.fillStyle = "#54341E";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(0, canvas.height, canvas.width, 10);
ctx.fillStyle = "#2B650D";
ctx.fill();
ctx.closePath();

//ctx.rotate(Math.PI);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var p = new Player(10,canvas.height-30);
//p.setGravity(0);
new Monster(700, 200);
//p.rotate(Math.PI);
setInterval(drawWorld, 10);