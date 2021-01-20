let Game = {
    //ENGINE
    channel : [[], [], [], []], //phisics, particle, button
    PHYSICS_CHANNEL : 1,
    PARTICLE_CHANNEL : 0,
    TEXT_CHANNEL : 2,
    BUTTON_CHANNEL : 3,
    time : 0,
    p:null,
    
    //CLIENT
    keyboardOn:false,
    isManager:false,

    //ENGINE FUNCTION
    resetGame:function() {
        Game.channel = [[], [], [], []];
        Game.time = 0;
        Game.keyboardOn=false;
        Magic.clearCoolTime();
        Magic.magicPoint=0;
        Level.stageLevel = -1;
        Level.stageMonsterCount = -1;
        Camera.cameraOn = false;
        Camera.extension=canvas.width/1200;
        Screen.bgColor="rgb(121, 155, 206)";
    },
    startGame:function() {
        document.addEventListener("keydown", this.keyDownHandler, false);
        document.addEventListener("keyup", this.keyUpHandler, false);
        canvas.addEventListener("mousedown", this.clickDownHandler, false);
        //{어두운 배경: #2B2B2B, 붉은빛하늘: #A89A9A, 붉은빛밤하늘: #3F3939, 보라빛밤하늘: #3C3647, 겨울아침:rgb(179, 211, 244)}
        
        Level.loadLevel();
        Magic.loadMagic();
        Screen.mainScreen();
    },
    updateWorld:function() {
        ctx.fillStyle=Screen.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 4; i++) {
            for (let j = Game.channel[i].length - 1, c = Game.channel[i]; j >= 0; j--) { c[j].update(); }
            Game.removeEntity(i);
        }
        Game.time++;

    },
    removeEntity:function(channelLevel) {
        for (let e of Game.channel[channelLevel]) {
            if (e.life < 1 && e.canRemoved) {
                e.removeHandler();
                let ei = Game.channel[channelLevel].indexOf(e);
                if (ei >= 0) Game.channel[channelLevel].splice(ei, 1);
            }
        }
    },
    //CLIENT FUNCITON
    keyDownHandler:function(e) {
        if(Game.keyboardOn)
        switch (e.keyCode) {
            case 39:Game.p.moveFlag = true;Game.p.isRight = true;break;//right
            case 37:Game.p.moveFlag = true;Game.p.isRight = false;break;//left
            case 38:Game.p.jump();break;//up
            case 32:Game.p.jump();break;//space
            case 81:Magic.doSkill(Game.p,0);break; //q
            case 87:Magic.doSkill(Game.p,1);break; //w
            case 69:Magic.doSkill(Game.p,2);break; //e
            case 82:Magic.doSkill(Game.p,3);break; //r
        }
    },
    keyUpHandler:function(e) {
        switch(e.keyCode){
            case 39:Game.p.moveFlag = false;break;
            case 37:Game.p.moveFlag = false;break;
        }
    },
    click:function(x, y) {
        let c = Game.channel[Game.BUTTON_CHANNEL];
        for (let i = c.length - 1; i >= 0; i--) {
            if (c[i].x < x && x < c[i].x + c[i].w && c[i].y < y && y < c[i].y + c[i].h) {
                c[i].collisionHandler(null, "down");
                break;
            }
        }
    },
    clickDownHandler:function(e) {
        e.preventDefault();
        Game.click(e.layerX, e.layerY);
    },
    touchStartHandler:function(e) {
        e.preventDefault();
        let touch= new Button(e.touches[0].clientX, e.touches[0].clientY, 0,0,Game.PARTICLE_CHANNEL);
        touch.canRemoved=true;
        touch.drawCode = function(){ctx.strokeRect(touch.x-5,touch.y-5, 10, 10);touch.life--;}
        touch.life=10;
        for(let i=0, max=e.touches.length; i<max; i++){
            Game.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchMoveHandler:function(e) {
        e.preventDefault();
        for(let i=0, max=e.touches.length; i<max; i++){
            Game.click(e.touches[i].clientX, e.touches[i].clientY);
        }
    },
    touchEndHandler:function(e) {
        e.preventDefault();
        if(e.touches.length==0)Game.p.moveFlag = false;
    },
    convertMobileMode:function(a) {
        if (a) {
            document.addEventListener("touchstart", this.touchStartHandler, false);
            canvas.addEventListener("touchmove", this.touchMoveHandler, false); //캔버스로 해야 더 빠름
            document.addEventListener("touchend", this.touchEndHandler, false);
            canvas.removeEventListener("mousedown", this.clickDownHandler, false);
            document.removeEventListener("keydown", this.keyDownHandler, false);
            document.removeEventListener("keyup", this.keyUpHandler, false);
            Screen.isMobile = true;
        } else {
            canvas.removeEventListener("touchstart", this.touchStartHandler, false);
            canvas.removeEventListener("touchmove", this.touchMoveHandler,false);
            canvas.removeEventListener("touchend", this.touchEndHandler, false);
            canvas.addEventListener("mousedown", this.clickDownHandler, false);
            document.addEventListener("keydown", this.keyDownHandler, false);
            document.addEventListener("keyup", this.keyUpHandler, false);
            Screen.isMobile = false;
        }
    }
}

Game.startGame();
let systemclock = setInterval(Game.updateWorld, 10);