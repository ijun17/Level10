var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

Game.startGame();
setInterval(Game.updateWorld, 10);