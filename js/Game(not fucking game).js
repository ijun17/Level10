

class Game {
    static channel = [new Array(), new Array(),new Array()]; //phisics, particle, button
    static time = 0;
    static p;

    //static clearEntitys() { entitys = []; }

    static restartGame(){
        Game.channel=[new Array(), new Array(),new Array()];
        Game.time=0;
        Magic.clearCoolTime();
        Level.stageLevel=-1;
        Level.stageMonsterCount=-1;
    }

    static startGame() {
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        canvas.addEventListener("mousedown", this.clickHandler, false);

        Level.loadLevel();
        Screen.menuScreen();
        Game.p = new Player(100, 100);
        Game.p.ga = -0.01;
    }

    static updateWorld() {
        if (Game.p != null && Game.p.moveFlag) {
            Game.p.go();
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var e of Game.channel[0]) { e.update(); }
        for (var e of Game.channel[1]) { e.update(); }
        for (var e of Game.channel[2]) { e.update(); }
        Game.time++;
    }

    static click(x,y){
        let clickE = new Block(x, y, 0, 0,"black",2);
        clickE.life = 1;
        clickE.overlap = true;
        clickE.collisionLevel = -8;
        clickE.canMove = false;
        clickE.ga=0;
        return clickE;
    }

    static keyDownHandler(e) {
        switch (e.keyCode) {
            case 39:
                Game.p.moveFlag = true;
                Game.p.isRight = true;
                break;
            case 37:
                Game.p.moveFlag = true;
                Game.p.isRight = false;
                break;
            case 38:
                Game.p.jump();
                break;
            case 81: //q
                Magic.doSkill(0);
                break;
            case 87: //w
                Magic.doSkill(1);
                break;
            case 69: //e
                Magic.doSkill(2);
                break;
            case 82: //r
                Magic.doSkill(3);
                break;
        }
    }

    static keyUpHandler(e) {
        if (e.keyCode == 39) {
            Game.p.moveFlag = false;
            //p.setVectorX(0);
        }
        else if (e.keyCode == 37) {
            Game.p.moveFlag = false;
            //p.setVectorX(0);
        }
    }

    static clickHandler(e) {
        //let clickE = new Block(e.layerX, e.layerY, 0, 0);
        Game.click(e.layerX, e.layerY);
    }

    
}